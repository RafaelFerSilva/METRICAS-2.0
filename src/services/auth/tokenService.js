import nookies from 'nookies';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';
const ACCESS_ORGANIZATION_KEY = 'ACCESS_ORGANIZATION_KEY';
const ACCESS_PROJECT_KEY = 'ACCESS_PROJECT_KEY';

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

export const tokenService = {
  saveProjectId(project_id, ctx = null) {
    nookies.set(ctx, ACCESS_PROJECT_KEY, project_id, {
      maxAge: ONE_DAY,
      path: '/'
    });
  },


  save(organization, access_token, ctx = null) {
    nookies.set(ctx, ACCESS_TOKEN_KEY, access_token, {
      maxAge: ONE_DAY,
      path: '/'
    });

    nookies.set(ctx, ACCESS_ORGANIZATION_KEY, organization, {
      maxAge: ONE_DAY,
      path: '/'
    });
  },

  get(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_TOKEN_KEY] || '';
  },

  getToken(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_TOKEN_KEY] || '';
  },

  getOrganization(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_ORGANIZATION_KEY] || '';
  },

  getProjectId(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_PROJECT_KEY] || '';
  },

  delete(ctx = null) {
    nookies.destroy(ctx, ACCESS_TOKEN_KEY)
    nookies.destroy(ctx, ACCESS_ORGANIZATION_KEY)
    nookies.destroy(ctx, ACCESS_PROJECT_KEY)
  }
}
