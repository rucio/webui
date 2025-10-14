'use client';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register all AG-Grid community modules globally
// This must be done before any grid is instantiated
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * AG-Grid Setup Component
 *
 * This component registers AG-Grid modules globally for the entire application.
 * It must be imported in the root layout to ensure modules are registered
 * before any grids are rendered.
 *
 * AG-Grid v33+ requires explicit module registration. We use AllCommunityModule
 * to include all community features. For smaller bundle sizes, individual modules
 * can be registered instead.
 */
export function AgGridSetup() {
    // This component doesn't render anything, it just registers modules
    return null;
}
