import { BaseInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { IronSession } from "iron-session";
import { GetSiteHeaderError, GetSiteHeaderRequest, GetSiteHeaderResponse } from "../../usecase-models/get-site-header-usecase-models";

/**
 * Interface that represents a UseCase that will gather information from avilable gateways to help generate the site header.
 */
export interface GetSiteHeaderInputPort extends BaseInputPort<GetSiteHeaderRequest> {}

/**
 * The interface defines a presenter that will generate a ViewModel used by the Site Header component.
 */
export interface GetSiteHeaderOutputPort extends BaseOutputPort<GetSiteHeaderResponse, GetSiteHeaderError> {}