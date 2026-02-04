---
marp: true
---

<style>
.scrollable-code {
  max-height: 450px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}
</style>

# Developer Onboarding Tutorial (30 minutes)

**Rucio WebUI - Clean Architecture Implementation**

---

## 📋 Tutorial Overview

This tutorial will teach you how to build features in the Rucio WebUI using Clean Architecture principles. You'll learn to:

1. **Create Secondary Output Port & Gateway** (with tests)
2. **Create a Feature** (UseCase + Controller + Presenter)
3. **Call Feature from a Page** (API Route + React Component)
4. **Design the Page** (UI Components)

**Example:** We'll build a `list-subscriptions` feature that fetches subscriptions from the Rucio server.

---

## 🏗️ Architecture Overview (3 min)

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                      │
│              (component-library/pages)                   │
└─────────────────────┬───────────────────────────────────┘
                      │ fetch()
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    API ROUTES                            │
│              (app/api/feature/*)                         │
└─────────────────────┬───────────────────────────────────┘
                      │ controller.execute()
                      ▼
┌─────────────────────────────────────────────────────────┐
│              CONTROLLER (Infrastructure)                 │
│         Maps HTTP params → UseCase request               │
└─────────────────────┬───────────────────────────────────┘
                      │ useCase.execute()
                      ▼
┌─────────────────────────────────────────────────────────┐
│         USE CASE (Core - Business Logic)                 │
│    Validates → Calls Gateway → Processes → Presents     │
└─────────────────────┬───────────────────────────────────┘
                      │ gateway.list()
                      ▼
┌─────────────────────────────────────────────────────────┐
│         GATEWAY (Infrastructure)                         │
│       Implements Port → Delegates to Endpoints           │
└─────────────────────┬───────────────────────────────────┘
                      │ endpoint.fetch()
                      ▼
┌─────────────────────────────────────────────────────────┐
│              ENDPOINT (Infrastructure)                   │
│      Builds HTTP request → Calls Rucio Server           │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Inversion**: Core layer defines interfaces (ports), infrastructure implements them
2. **Separation of Concerns**: Each layer has a single responsibility
3. **Testability**: Mock gateways and test business logic independently
4. **Streaming Support**: Endpoints can stream NDJSON data for large datasets

---

## 📝 PART 1: Secondary Output Port & Gateway (8 min)

### Step 1.1: Define the Secondary Output Port (Interface)

**Purpose**: Define what operations the gateway must support

**File**: `src/lib/core/port/secondary/subscription-gateway-output-port.ts`

```typescript
import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { ListSubscriptionsDTO, SubscriptionDTO } from '../../dto/subscription-dto';

export default interface SubscriptionGatewayOutputPort {
    /**
     * Lists all subscriptions for a given account in an NDJSON stream
     * @param rucioAuthToken A valid rucio auth token
     * @param account The rucio account name for which subscriptions should be listed
     */
    list(rucioAuthToken: string, account: string): Promise<ListSubscriptionsDTO>;
}
```

**Key Points**:
- Interface only (no implementation)
- Clear JSDoc comments
- Returns DTO (Data Transfer Object)
- Located in `core/port/secondary` (part of business logic layer)

---

### Step 1.2: Define DTOs

**Purpose**: Define data structures passed between layers

**File**: `src/lib/core/dto/subscription-dto.ts`

```typescript
import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { Subscription } from '../entity/rucio';

export interface SubscriptionDTO extends Subscription, BaseDTO {}

export interface ListSubscriptionsDTO extends BaseStreamableDTO {
    // Inherits: status, stream, error fields
}
```

**Key Points**:
- DTOs extend `BaseDTO` or `BaseStreamableDTO`
- Streaming DTOs include a `stream` field or error info
- Located in `core/dto` (domain layer)

---

### Step 1.3: Implement the Gateway

**Purpose**: Implement the port interface by delegating to endpoints

**File**: `src/lib/infrastructure/gateway/subscription-gateway/subscription-gateway.ts`

<div class="scrollable-code">

```typescript
import { ListSubscriptionsDTO } from '@/lib/core/dto/subscription-dto';
import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import { injectable } from 'inversify';
import ListSubscriptionsEndpoint from './endpoints/list-subscriptions-endpoint';

@injectable()
export default class SubscriptionGateway implements SubscriptionGatewayOutputPort {
    async list(rucioAuthToken: string, account: string): Promise<ListSubscriptionsDTO> {
        try {
            const endpoint: ListSubscriptionsEndpoint = new ListSubscriptionsEndpoint(
                rucioAuthToken,
                account
            );
            const errorDTO: ListSubscriptionsDTO | undefined = await endpoint.fetch();

            // If no error, wrap the stream in success DTO
            if (!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint,
                };
            }
            return errorDTO;
        } catch (error) {
            const errorDTO: ListSubscriptionsDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching subscriptions',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }
}
```

</div>

**Key Points**:
- `@injectable()` decorator for dependency injection
- Creates endpoint instance and calls `fetch()`
- For streaming: returns `{ status: 'success', stream: endpoint }`
- Handles errors consistently
- Located in `infrastructure/gateway`

---

### Step 1.4: Create the Endpoint

**Purpose**: Make HTTP requests to Rucio server and transform data

**File**: `src/lib/infrastructure/gateway/subscription-gateway/endpoints/list-subscriptions-endpoint.ts`

<div class="scrollable-code">

```typescript
import { HTTPRequest } from '@/lib/sdk/http';
import { ListSubscriptionsDTO, SubscriptionDTO } from '@/lib/core/dto/subscription-dto';
import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { Response } from 'node-fetch';
import { convertToSubscriptionDTO, TRucioSubscription } from '../subscription-gateway-utils';

export default class ListSubscriptionsEndpoint extends BaseStreamableEndpoint<
    ListSubscriptionsDTO,
    SubscriptionDTO
> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string
    ) {
        super(true); // streamAsNDJSON = true
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/subscriptions/${this.account}`;

        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined,
        };

        this.request = request;
        this.initialized = true;
    }

    async reportErrors(
        statusCode: number,
        response: Response
    ): Promise<ListSubscriptionsDTO | undefined> {
        switch (statusCode) {
            case 404:
                return {
                    status: 'error',
                    error: {
                        errorMessage: 'Subscription or Account not found.',
                        errorCode: statusCode,
                    },
                    stream: null,
                };
            default:
                return {
                    status: 'error',
                    error: {
                        errorMessage: 'Unknown Error occurred',
                        errorCode: statusCode,
                    },
                    stream: null,
                };
        }
    }

    createDTO(response: Buffer): SubscriptionDTO {
        // Parse NDJSON line
        const data: TRucioSubscription = JSON.parse(JSON.parse(response.toString()));
        const dto: SubscriptionDTO = convertToSubscriptionDTO(data, this.account);
        return dto;
    }
}
```

</div>

**Key Points**:
- Extends `BaseStreamableEndpoint<TDTO, TStreamData>`
- `initialize()`: builds the HTTP request
- `reportErrors()`: handles custom HTTP error codes
- `createDTO()`: transforms each streamed line to DTO
- NDJSON streams send one JSON object per line

---

### Step 1.5: Create Gateway Utils (Data Transformation)

**Purpose**: Convert Rucio API format to internal DTOs

**File**: `src/lib/infrastructure/gateway/subscription-gateway/subscription-gateway-utils.ts`

<div class="scrollable-code">

```typescript
import { SubscriptionDTO } from '@/lib/core/dto/subscription-dto';
import { SubscriptionState } from '@/lib/core/entity/rucio';

export type TRucioSubscription = {
    id: string;
    name: string;
    account: string;
    state: string;
    filter: string;
    replication_rules: string; // JSON string
    created_at: string;
    updated_at: string;
    // ... more fields
};

export function convertToSubscriptionDTO(
    data: TRucioSubscription,
    account: string
): SubscriptionDTO {
    return {
        status: 'success',
        id: data.id,
        name: data.name,
        account: account,
        state: parseSubscriptionState(data.state),
        filter: data.filter,
        replication_rules: parseReplicationRules(data.replication_rules),
        created_at: data.created_at,
        updated_at: data.updated_at,
        // ... more fields
    };
}

function parseSubscriptionState(state: string): SubscriptionState {
    switch (state.toUpperCase()) {
        case 'ACTIVE':
            return SubscriptionState.ACTIVE;
        case 'INACTIVE':
            return SubscriptionState.INACTIVE;
        default:
            return SubscriptionState.UNKNOWN;
    }
}
```

</div>

**Key Points**:
- Define types for Rucio API response (`TRucioSubscription`)
- Convert to internal DTO format
- Parse enums and complex fields
- Located in same directory as gateway

---

### Step 1.6: Write Gateway Tests

**Purpose**: Test gateway with mocked Rucio server

**File**: `test/gateway/subscription/subscription-gateway.test.ts`

<div class="scrollable-code">

```typescript
import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { ListSubscriptionsDTO, SubscriptionDTO } from '@/lib/core/dto/subscription-dto';

describe('SubscriptionGateway - list()', () => {
    beforeEach(() => {
        fetchMock.doMock();

        const subscriptionStream = Readable.from(
            [
                JSON.stringify({ id: '1', name: 'Sub1', account: 'ddmadmin', /* ... */ }),
                JSON.stringify({ id: '2', name: 'Sub2', account: 'ddmadmin', /* ... */ }),
            ].join('\n')
        );

        const listSubscriptionsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin`,
            method: 'GET',
            endsWith: 'subscriptions/ddmadmin',
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/x-json-stream' },
                body: subscriptionStream,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listSubscriptionsEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should stream subscriptions', async () => {
        const gateway: SubscriptionGatewayOutputPort = appContainer.get(
            GATEWAYS.SUBSCRIPTION
        );
        const listDTO: ListSubscriptionsDTO = await gateway.list(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'ddmadmin'
        );

        expect(listDTO.status).toEqual('success');
        expect(listDTO.stream).toBeDefined();

        const receivedData: SubscriptionDTO[] = [];

        await new Promise((resolve, reject) => {
            listDTO.stream.on('data', (data: SubscriptionDTO) => {
                receivedData.push(data);
            });
            listDTO.stream.on('end', resolve);
            listDTO.stream.on('error', reject);
        });

        expect(receivedData.length).toEqual(2);
        expect(receivedData[0].name).toEqual('Sub1');
    });
});
```

</div>

**Key Points**:
- Use `MockRucioServerFactory` to mock HTTP endpoints
- Use `Readable.from()` to create NDJSON streams
- Test stream handling with event listeners (`data`, `end`, `error`)
- Get gateway from IoC container
- Located in `test/gateway/`

---

## 🎯 PART 2: Create a Feature (8 min)

A **feature** consists of: UseCase + Controller + Presenter + IoC registration

### Step 2.1: Define UseCase Models

**Purpose**: Define request, response, and error models for business logic

**File**: `src/lib/core/usecase-models/list-subscriptions-usecase-models.ts`

```typescript
import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { Subscription } from '../entity/rucio';

export interface ListSubscriptionsRequest {
    account: string;
}

export interface ListSubscriptionsResponse extends Subscription, BaseResponseModel {}

export interface ListSubscriptionsError extends BaseErrorResponseModel {
    error: 'INVALID_ACCOUNT' | string;
}
```

**Key Points**:
- `Request`: input to use case
- `Response`: successful output
- `Error`: error cases
- Extend base models for consistency
- Located in `core/usecase-models`

---

### Step 2.2: Define Input/Output Ports

**Purpose**: Define interfaces for use case execution

**File**: `src/lib/core/port/primary/list-subscriptions-port.ts`

```typescript
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { ListSubscriptionsRequest, ListSubscriptionsResponse, ListSubscriptionsError } from '../../usecase-models/list-subscriptions-usecase-models';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';

export interface ListSubscriptionsInputPort {
    execute(request: AuthenticatedRequestModel<ListSubscriptionsRequest>): Promise<void>;
}

export interface ListSubscriptionsOutputPort {
    presentSuccess(response: ListSubscriptionsResponse): SubscriptionViewModel;
    presentError(error: ListSubscriptionsError): SubscriptionViewModel;
}
```

**Key Points**:
- `InputPort`: how to call the use case
- `OutputPort`: how to present results (implemented by presenter)
- Located in `core/port/primary`

---

### Step 2.3: Create the UseCase

**Purpose**: Orchestrate business logic - validate, call gateway, process results

**File**: `src/lib/core/use-case/list-subscriptions-usecase.ts`

<div class="scrollable-code">

```typescript
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { injectable } from 'inversify';
import { ListSubscriptionsDTO, SubscriptionDTO } from '../dto/subscription-dto';
import { ListSubscriptionsInputPort, ListSubscriptionsOutputPort } from '../port/primary/list-subscriptions-port';
import type SubscriptionGatewayOutputPort from '../port/secondary/subscription-gateway-output-port';
import { ListSubscriptionsError, ListSubscriptionsRequest, ListSubscriptionsResponse } from '../usecase-models/list-subscriptions-usecase-models';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';

@injectable()
class ListSubscriptionsUseCase
    extends BaseSingleEndpointStreamingUseCase<
        ListSubscriptionsRequest,
        ListSubscriptionsResponse,
        ListSubscriptionsError,
        ListSubscriptionsDTO,
        SubscriptionDTO,
        SubscriptionViewModel
    >
    implements ListSubscriptionsInputPort
{
    constructor(
        protected presenter: ListSubscriptionsOutputPort,
        private subscriptionGateway: SubscriptionGatewayOutputPort
    ) {
        super(presenter);
    }

    validateRequestModel(
        requestModel: AuthenticatedRequestModel<ListSubscriptionsRequest>
    ): ListSubscriptionsError | undefined {
        if (!requestModel.account || requestModel.account === '') {
            return {
                status: 'error',
                error: 'INVALID_ACCOUNT',
                message: 'Account is required',
            };
        }
    }

    async intializeRequest(
        request: AuthenticatedRequestModel<ListSubscriptionsRequest>
    ): Promise<ListSubscriptionsError | undefined> {
        return undefined; // No initialization needed
    }

    async makeGatewayRequest(
        requestModel: AuthenticatedRequestModel<ListSubscriptionsRequest>
    ): Promise<ListSubscriptionsDTO> {
        const { rucioAuthToken, account } = requestModel;
        return await this.subscriptionGateway.list(rucioAuthToken, account);
    }

    handleGatewayError(error: ListSubscriptionsDTO): ListSubscriptionsError {
        return {
            status: 'error',
            error: `Gateway error: ${error.errorCode}`,
            message: error.errorMessage || 'Gateway Error',
            code: error.errorCode,
        };
    }

    processStreamedData(
        dto: SubscriptionDTO
    ): { data: ListSubscriptionsError | ListSubscriptionsResponse; status: 'success' | 'error' } {
        if (dto.status === 'error') {
            return {
                status: 'error',
                data: {
                    status: 'error',
                    error: dto.errorName || 'Gateway Error',
                    code: dto.errorCode || 500,
                    message: dto.errorMessage || 'Processing error',
                },
            };
        }

        const responseModel: ListSubscriptionsResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}

export default ListSubscriptionsUseCase;
```

</div>

**Key Points**:
- Extends `BaseSingleEndpointStreamingUseCase` for streaming data
- Inject presenter and gateway in constructor
- Implement lifecycle methods:
  - `validateRequestModel()`: input validation
  - `intializeRequest()`: pre-processing (optional)
  - `makeGatewayRequest()`: call gateway
  - `handleGatewayError()`: convert gateway errors
  - `processStreamedData()`: transform each streamed DTO
- Located in `core/use-case`

---

### Step 2.4: Create the Controller

**Purpose**: Map HTTP request parameters to UseCase request model

**File**: `src/lib/infrastructure/controller/list-subscriptions-controller.ts`

<div class="scrollable-code">

```typescript
import { ListSubscriptionsInputPort } from '@/lib/core/port/primary/list-subscriptions-port';
import { ListSubscriptionsRequest } from '@/lib/core/usecase-models/list-subscriptions-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { inject, injectable } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type ListSubscriptionsControllerParameters = TAuthenticatedControllerParameters & {
    sessionAccount: string;
};

@injectable()
class ListSubscriptionsController extends BaseController<
    ListSubscriptionsControllerParameters,
    AuthenticatedRequestModel<ListSubscriptionsRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_SUBSCRIPTIONS)
        listSubscriptionsUseCaseFactory: (response: Signal) => ListSubscriptionsInputPort
    ) {
        super(listSubscriptionsUseCaseFactory);
    }

    prepareRequestModel(
        parameters: ListSubscriptionsControllerParameters
    ): AuthenticatedRequestModel<ListSubscriptionsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.sessionAccount,
        };
    }
}

export default ListSubscriptionsController;
```

</div>

**Key Points**:
- Extends `BaseController<Parameters, RequestModel>`
- Inject use case factory from IoC
- Implement `prepareRequestModel()` to map parameters
- `rucioAuthToken` added automatically by framework
- Located in `infrastructure/controller`

---

### Step 2.5: Create the Presenter

**Purpose**: Transform response/error models to view models for UI

**File**: `src/lib/infrastructure/presenter/list-subscriptions-presenter.ts`

<div class="scrollable-code">

```typescript
import { ListSubscriptionsError, ListSubscriptionsResponse } from '@/lib/core/usecase-models/list-subscriptions-usecase-models';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { getEmptySubscriptionViewModel, SubscriptionViewModel } from '../data/view-model/subscriptions';

export default class ListSubscriptionsPresenter extends BaseStreamingPresenter<
    ListSubscriptionsResponse,
    ListSubscriptionsError,
    SubscriptionViewModel
> {
    streamResponseModelToViewModel(responseModel: ListSubscriptionsResponse): SubscriptionViewModel {
        // Convert response model to view model (for UI)
        const viewModel: SubscriptionViewModel = {
            ...responseModel,
            replication_rules: JSON.stringify(responseModel.replication_rules), // Stringify for serialization
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListSubscriptionsError): SubscriptionViewModel {
        const viewModel = getEmptySubscriptionViewModel();
        viewModel.message = error.message;
        viewModel.status = 'error';
        return viewModel;
    }

    convertErrorModelToViewModel(
        errorModel: ListSubscriptionsError
    ): { status: number; viewModel: SubscriptionViewModel } {
        const viewModel = getEmptySubscriptionViewModel();

        if (errorModel.error === 'INVALID_ACCOUNT') {
            viewModel.message = errorModel.message;
            return { status: 400, viewModel };
        }

        viewModel.message = errorModel.message || 'Unknown error';
        const status = errorModel.code || 500;
        return { status, viewModel };
    }
}
```

</div>

**Key Points**:
- Extends `BaseStreamingPresenter`
- Implement transformation methods:
  - `streamResponseModelToViewModel()`: success case
  - `streamErrorModelToViewModel()`: error in stream
  - `convertErrorModelToViewModel()`: overall error + HTTP status
- Located in `infrastructure/presenter`

---

### Step 2.6: Create View Model

**Purpose**: Define data shape for UI consumption

**File**: `src/lib/infrastructure/data/view-model/subscriptions.ts`

```typescript
import { Subscription, SubscriptionState } from '@/lib/core/entity/rucio';
import { BaseViewModel } from '@/lib/sdk/view-models';

export interface SubscriptionViewModel extends BaseViewModel, Omit<Subscription, 'replication_rules'> {
    replication_rules: string; // Stringified for JSON serialization
}

export function getEmptySubscriptionViewModel(): SubscriptionViewModel {
    return {
        status: 'error',
        account: '',
        id: '',
        name: '',
        state: SubscriptionState.UNKNOWN,
        filter: '',
        replication_rules: '',
        created_at: '',
        updated_at: '',
    };
}
```

**Key Points**:
- Extends `BaseViewModel` (includes `status`, `message`)
- May differ from domain model (e.g., stringified JSON)
- Helper function for empty/error view model
- Located in `infrastructure/data/view-model`

---

### Step 2.7: Register Feature in IoC

**Purpose**: Wire UseCase, Controller, Presenter together via dependency injection

**File**: `src/lib/infrastructure/ioc/features/list-subscriptions-feature.ts`

<div class="scrollable-code">

```typescript
import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import ListSubscriptionsUseCase from '@/lib/core/use-case/list-subscriptions-usecase';
import { BaseStreamableFeature } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import ListSubscriptionsController, { ListSubscriptionsControllerParameters } from '../../controller/list-subscriptions-controller';
import { SubscriptionViewModel } from '../../data/view-model/subscriptions';
import ListSubscriptionsPresenter from '../../presenter/list-subscriptions-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';
import {
    ListSubscriptionsError,
    ListSubscriptionsRequest,
    ListSubscriptionsResponse
} from '@/lib/core/usecase-models/list-subscriptions-usecase-models';

export default class ListSubscriptionsFeature extends BaseStreamableFeature<
    ListSubscriptionsControllerParameters,
    ListSubscriptionsRequest,
    ListSubscriptionsResponse,
    ListSubscriptionsError,
    SubscriptionViewModel
> {
    constructor(appContainer: Container) {
        const subscriptionGateway = appContainer.get<SubscriptionGatewayOutputPort>(
            GATEWAYS.SUBSCRIPTION
        );

        const symbols = {
            CONTROLLER: CONTROLLERS.LIST_SUBSCRIPTIONS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_SUBSCRIPTIONS,
            INPUT_PORT: INPUT_PORT.LIST_SUBSCRIPTIONS,
        };

        super(
            'ListSubscriptions',              // Feature name
            ListSubscriptionsController,      // Controller class
            ListSubscriptionsUseCase,         // UseCase class
            [subscriptionGateway],            // UseCase constructor args
            ListSubscriptionsPresenter,       // Presenter class
            false,                            // passSessionToPresenter
            symbols,                          // IoC symbols
        );
    }
}
```

**Then register in container:**

**File**: `src/lib/infrastructure/ioc/container-config.ts` (excerpt)

```typescript
import { Container } from 'inversify';
import { loadFeaturesSync } from '@/lib/sdk/ioc-helpers';
import ListSubscriptionsFeature from './features/list-subscriptions-feature';
// ... other imports

const appContainer = new Container();

// Bind gateways
appContainer.bind<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION).to(SubscriptionGateway);

// Load features
loadFeaturesSync(appContainer, [
    new ListSubscriptionsFeature(appContainer),
    // ... other features
]);

export default appContainer;
```

</div>

**Key Points**:
- Extends `BaseStreamableFeature` (or `BaseFeature` for non-streaming)
- Retrieves gateway from container
- Passes all components and their dependencies
- Register in `container-config.ts`
- Located in `infrastructure/ioc/features`

---

## 🔌 PART 3: Call Feature from a Page (6 min)

### Step 3.1: Create API Route

**Purpose**: Expose controller as HTTP endpoint

**File**: `src/app/api/feature/list-subscription/route.ts`

<div class="scrollable-code">

```typescript
import 'reflect-metadata'; // Required for Inversify
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListSubscriptionsControllerParameters } from '@/lib/infrastructure/controller/list-subscriptions-controller';
import {
    executeAuthenticatedController,
    parseQueryParams
} from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/list-subscription
 * Returns a list of subscriptions as NDJSON stream
 */
export async function GET(request: NextRequest) {
    try {
        // 1. Get session user
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionUser.rucioAccount) {
            return NextResponse.json(
                { error: 'Invalid Session. No Rucio Account found' },
                { status: 400 }
            );
        }

        // 2. Parse query params (if needed)
        const params = parseQueryParams(request);

        // 3. Get controller from IoC container
        const controller = appContainer.get<
            BaseController<ListSubscriptionsControllerParameters, void>
        >(CONTROLLERS.LIST_SUBSCRIPTIONS);

        // 4. Execute controller
        return executeAuthenticatedController(
            controller,
            {
                sessionAccount: sessionUser.rucioAccount,
                // rucioAuthToken will be added automatically
            },
            true // isStreaming = true for NDJSON response
        );
    } catch (error) {
        console.error('Error in list-subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

</div>

**Key Points**:
- Import `'reflect-metadata'` at the top
- Validate session and authentication
- Parse query/body parameters
- Get controller from IoC container
- Call `executeAuthenticatedController()`:
  - Adds `rucioAuthToken` automatically
  - Set `isStreaming: true` for NDJSON responses
- Located in `app/api/feature/`

---

### Step 3.2: Create React Component (Page)

**Purpose**: Call API route and display data using React hooks

**File**: `src/component-library/pages/Subscriptions/list/ListSubscriptionTutorialExample.tsx`

> **Note**: The actual production `ListSubscription.tsx` component uses a different endpoint (`list-subscription-rule-states`) that returns aggregated rule state counts. For this tutorial, we've created `ListSubscriptionTutorialExample.tsx` to demonstrate the `list-subscriptions` feature that returns individual subscription records.

<div class="scrollable-code">

```typescript
import { ListSubscriptionTutorialTable } from './ListSubscriptionTutorialTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type ListSubscriptionTutorialExampleProps = {
    initialData?: SubscriptionViewModel[];
};

export const ListSubscriptionTutorialExample = (props: ListSubscriptionTutorialExampleProps) => {
    // Hook for streaming table data
    const { gridApi, onGridReady, streamingHook, startStreaming } =
        useTableStreaming<SubscriptionViewModel>(props.initialData);

    const [startedStreaming, setStartedStreaming] = useState(false);

    // Start streaming when table is ready
    useEffect(() => {
        if (!props.initialData && gridApi !== null && !startedStreaming) {
            startStreaming('/api/feature/list-subscription');
            setStartedStreaming(true);
        }
    }, [gridApi, startStreaming, startedStreaming]);

    // Get user account (non-streaming query)
    const {
        data: siteHeader,
        error: siteHeaderError,
        isFetching,
    } = useQuery({
        queryKey: ['subscription-account'],
        queryFn: async () => {
            const res = await fetch('/api/feature/get-site-header');
            return res.json();
        },
        retry: false,
    });

    if (isFetching) return <div>Loading...</div>;
    if (siteHeaderError) return <div>Error loading account</div>;

    const account = siteHeader.activeAccount.rucioAccount;

    return (
        <div className="flex flex-col space-y-3 w-full">
            <Heading text="Subscriptions" />
            <Heading size="sm" text={`for account ${account}`} />
            <ListSubscriptionTutorialTable
                streamingHook={streamingHook}
                onGridReady={onGridReady}
                account={account}
            />
        </div>
    );
};
```

</div>

**Key Points**:
- Use `useTableStreaming` hook for NDJSON streaming
- Call `startStreaming('/api/feature/...')` when table ready
- Use `useQuery` for regular API calls
- Handle loading and error states
- Located in `component-library/pages/`

---

### Step 3.3: Create Table Component

**Purpose**: Display streamed data in AG Grid table

**File**: `src/component-library/pages/Subscriptions/list/ListSubscriptionTutorialTable.tsx`

<div class="scrollable-code">

```typescript
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { GridReadyEvent } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';

type ListSubscriptionTutorialTableProps = {
    streamingHook: UseStreamReader<SubscriptionViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    account: string;
};

const ClickableName = (props: { value: string; account: string }) => {
    return (
        <ClickableCell href={`/subscription/page/${props.account}/${props.value}`}>
            {props.value}
        </ClickableCell>
    );
};

export const ListSubscriptionTutorialTable = (props: ListSubscriptionTutorialTableProps) => {
    const tableRef = useRef<AgGridReact<SubscriptionViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            flex: 5,
            minWidth: 300,
            cellRenderer: ClickableName,
            cellRendererParams: { account: props.account },
            filter: true,
        },
        {
            headerName: 'State',
            field: 'state',
            flex: 2,
            minWidth: 150,
        },
        {
            headerName: 'Created',
            field: 'created_at',
            flex: 3,
            minWidth: 200,
        },
    ]);

    return (
        <StreamedTable
            columnDefs={columnDefs}
            tableRef={tableRef}
            {...props}
        />
    );
};
```

</div>

**Key Points**:
- Use `StreamedTable` component (handles streaming automatically)
- Define `columnDefs` for AG Grid
- Use custom cell renderers for links, badges, etc.
- Pass streaming hook from parent component

---

## 🎨 PART 4: Design the Page (3 min)

### Styling Patterns

**Tailwind CSS** is used throughout:

```typescript
// Layout container
<div className="flex flex-col space-y-3 w-full grow">

// Card/panel
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">

// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">

// Table
<div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
```

### Component Library

**Reusable atoms** in `component-library/atoms/`:
- `<Heading>`: Page/section titles
- `<InfoField>`: Info messages
- `<WarningField>`: Warning messages
- `<ErrorField>`: Error messages

**Reusable features** in `component-library/features/`:
- `<StreamedTable>`: AG Grid wrapper for streaming data
- `<RuleStateBadge>`: Status badges
- `<ClickableCell>`: Table cells with links

**Example**:

```typescript
import { Heading } from '@/component-library/atoms/misc/Heading';
import { InfoField } from '@/component-library/features/fields/InfoField';

return (
    <div className="flex flex-col space-y-3">
        <Heading text="Subscriptions" />
        <InfoField>
            <span>Loading subscriptions...</span>
        </InfoField>
    </div>
);
```

---

## 📋 Quick Reference: File Checklist

When creating a new feature `MyFeature` for listing items:

### Core Layer (Business Logic)
- [ ] `src/lib/core/entity/rucio.ts` - Add entity types if needed
- [ ] `src/lib/core/dto/my-feature-dto.ts` - DTOs
- [ ] `src/lib/core/port/secondary/my-feature-gateway-output-port.ts` - Gateway interface
- [ ] `src/lib/core/port/primary/my-feature-port.ts` - Input/Output ports
- [ ] `src/lib/core/usecase-models/my-feature-usecase-models.ts` - Request/Response/Error models
- [ ] `src/lib/core/use-case/my-feature-usecase.ts` - Use case implementation

### Infrastructure Layer
- [ ] `src/lib/infrastructure/gateway/my-feature-gateway/my-feature-gateway.ts` - Gateway implementation
- [ ] `src/lib/infrastructure/gateway/my-feature-gateway/endpoints/list-my-feature-endpoint.ts` - Endpoint
- [ ] `src/lib/infrastructure/gateway/my-feature-gateway/my-feature-gateway-utils.ts` - Data transformers
- [ ] `src/lib/infrastructure/controller/my-feature-controller.ts` - Controller
- [ ] `src/lib/infrastructure/presenter/my-feature-presenter.ts` - Presenter
- [ ] `src/lib/infrastructure/data/view-model/my-feature.ts` - View model
- [ ] `src/lib/infrastructure/ioc/features/my-feature-feature.ts` - Feature registration
- [ ] `src/lib/infrastructure/ioc/ioc-symbols-*.ts` - Add symbols

### API & UI
- [ ] `src/app/api/feature/my-feature/route.ts` - API route
- [ ] `src/component-library/pages/MyFeature/MyFeature.tsx` - Main page component
- [ ] `src/component-library/pages/MyFeature/MyFeatureTable.tsx` - Table component

### Tests
- [ ] `test/gateway/my-feature/my-feature-gateway.test.ts` - Gateway tests
- [ ] `test/fixtures/rucio-server.ts` - Add mock endpoints

---

## 🔑 Key Concepts Summary

### 1. **Streaming vs Non-Streaming**

| Aspect | Streaming | Non-Streaming |
|--------|-----------|---------------|
| **Use Case Base** | `BaseSingleEndpointStreamingUseCase` | `BaseSingleEndpointUseCase` |
| **Endpoint Base** | `BaseStreamableEndpoint` | `BaseEndpoint` |
| **Presenter Base** | `BaseStreamingPresenter` | `BasePresenter` |
| **Response Format** | NDJSON (one JSON per line) | Single JSON |
| **Method** | `processStreamedData()` | `processDTO()` |
| **API Route** | `isStreaming: true` | `isStreaming: false` |

### 2. **Data Flow**

```
Rucio API Response (TRucio*)
    ↓ (gateway-utils converter)
DTO (Core layer)
    ↓ (UseCase.processStreamedData)
Response Model (Core layer)
    ↓ (Presenter.streamResponseModelToViewModel)
View Model (Infrastructure)
    ↓ (API Route serialization)
React Component (UI)
```

### 3. **Dependency Injection**

- **@injectable()**: Mark classes for IoC
- **@inject(SYMBOL)**: Inject dependencies by symbol
- **appContainer.get(SYMBOL)**: Retrieve from container
- **Features**: Bundle UseCase + Controller + Presenter

### 4. **Testing Strategy**

- **Gateway Tests**: Mock Rucio server, test data transformation
- **UseCase Tests**: Mock gateway, test business logic
- **Integration Tests**: Test full feature end-to-end

---

## 🚨 Common Pitfalls

1. **Forgetting `'reflect-metadata'`** in API routes → Inversify fails
2. **Not setting `isStreaming: true`** for streaming endpoints → Response not chunked
3. **Missing `@injectable()`** decorator → IoC can't instantiate
4. **Wrong DTO type in endpoint** → `BaseStreamableEndpoint<DTO, StreamData>` types
5. **Not handling errors in streams** → Errors appear as data items
6. **Forgetting to register feature** in `container-config.ts` → 404 errors

---

## 🎯 Summary

You've learned to build features using **Clean Architecture**:

1. **Gateway Layer**: Port + Gateway + Endpoint + Tests
2. **UseCase Layer**: Models + UseCase + Ports
3. **Controller Layer**: Maps HTTP → UseCase
4. **Presenter Layer**: Transforms to View Models
5. **API Layer**: Next.js route handlers
6. **UI Layer**: React components with hooks

**Next Steps**: Try building a new feature on your own! Start with the file checklist above.

---

## 📚 Additional Resources

- **Clean Architecture**: Robert C. Martin - "Clean Architecture: A Craftsman's Guide"
- **Dependency Injection**: Inversify documentation - https://inversify.io/
- **Streaming**: NDJSON specification - http://ndjson.org/
- **Testing**: Jest documentation - https://jestjs.io/

---

## 📌 Tutorial Example Files

This tutorial uses the `list-subscriptions` feature as a complete example. All the backend infrastructure (Gateway, UseCase, Controller, Presenter) exists in the production codebase. For the frontend components, we've created tutorial-specific example files:

**Tutorial Example Components** (created for this tutorial):
- `src/component-library/pages/Subscriptions/list/ListSubscriptionTutorialExample.tsx` - Main page component
- `src/component-library/pages/Subscriptions/list/ListSubscriptionTutorialTable.tsx` - Table component

**Production Components** (actual implementation):
- `src/component-library/pages/Subscriptions/list/ListSubscription.tsx` - Uses `list-subscription-rule-states` endpoint
- `src/component-library/pages/Subscriptions/list/ListSubscriptionTable.tsx` - Displays aggregated rule state counts

The tutorial example components demonstrate the `list-subscriptions` feature that returns individual subscription records, while the production components use a different feature that returns aggregated subscription rule state counts. Both are valid examples of the Clean Architecture pattern described in this tutorial.

---

**Questions?** Ask the team or check existing implementations in:
- `src/lib/core/use-case/list-rules-usecase.ts`
- `src/lib/infrastructure/gateway/rule-gateway/`
- `test/gateway/rule/`