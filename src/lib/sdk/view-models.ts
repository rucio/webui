/**
 * A base type for view models.
 * @property status A string that indicates the status of the view model. Can be either `'success'` or `'error'`.
 * @property message An optional string that provides additional information about the view model.
 */
export type BaseViewModel = {
    status: 'success' | 'error' | 'pending';
    message?: string;
};
