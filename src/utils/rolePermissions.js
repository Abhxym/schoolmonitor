export const ROLES = {
    KENDRAPRAMUK: 'kendrapramuk',
    MUKHYADHYAPAK: 'mukhyadhyapak',
};

export const PERMISSIONS = {
    kendrapramuk: [
        'view:all_schools',
        'view:all_attendance',
        'view:all_reports',
        'view:all_events',
        'approve:events',
        'review:reports',
        'view:notifications',
        'view:dashboard_admin',
        'view:form_responses',
        'view:gr_management',
    ],
    mukhyadhyapak: [
        'view:own_school',
        'view:own_attendance',
        'submit:attendance',
        'view:own_reports',
        'submit:reports',
        'create:events',
        'view:own_events',
        'view:dashboard_headmaster',
        'view:gr',
    ],
};

export const can = (role, permission) => PERMISSIONS[role]?.includes(permission) ?? false;
