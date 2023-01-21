'use strict';

const HTTP_STATUS_CODES = {
  BAD_GATEWAY: {
    message: 'Bad Gateway',
    status: 502
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    status: 500
  },
  UNAUTHORIZED: {
    message: 'O usuário ou a senha não foram informados ou estão incorretos',
    status: 401
  },
  BAD_REQUEST: {
    message: 'Bad Request',
    status: 400
  },
  FORBIDDEN: {
    message: 'Forbidden',
    status: 403
  },
  NOT_FOUND: {
    message: 'Not Found',
    status: 404
  },
  PRECONDITION_FAILED: {
    message: 'Precondition Failed',
    status: 412
  },
  GETWAY_TIMEOUT: {
    message: 'Gateway Timeout',
    status: 504
  },
};

export { 
  HTTP_STATUS_CODES
};