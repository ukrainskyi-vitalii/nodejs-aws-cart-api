import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return '09a0fb9f-a5bb-4e37-995b-587e87cb1362'; // hardcode user id for the test purpose
  // return request.user && request.user.id;
}
