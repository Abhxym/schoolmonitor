import { can, ROLES } from '../utils/rolePermissions';

export function useRole(user) {
    const role = user?.role ?? null;

    return {
        role,
        isKendrapramuk: role === ROLES.KENDRAPRAMUK,
        isMukhyadhyapak: role === ROLES.MUKHYADHYAPAK,
        can: (permission) => can(role, permission),
        schoolId: user?.schoolId ?? null,
    };
}
