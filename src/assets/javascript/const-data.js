export const ui_version = '2.1.1'
export const work_modes = ['On-site', 'Remote', 'Hybrid ']
export const e_types = ['Part time', 'Full time']
export const prospect_type = ['Lead', 'Enquiry', 'Installation']
export const prospect_status = ['Completed', 'Cancelled']
export const prospect_urgency = ['Hot', 'Warm', 'Cool']





export const origins_head_list = [
    {
        id: 'ttcr',
        title: 'Time Track Controller',
        description: 'Control workers attendance reports',
        sections: [
            {
                id: 'ttcr_stfAcc',
                title: 'Worker accounts',
                description: 'Provides access to view, create, update, and delete workers accounts',
                origins: [
                    {
                        key: 'ttcr_stfAcc_read',
                        name: 'Read'
                    },
                    {
                        key: 'ttcr_stfAcc_write',
                        name: 'Read and Write'
                    },
                ]
            },
            {
                id: 'ttcr_l2',
                title: 'Leave letter',
                description: 'Allows viewing and managing workers leave applications',
                origins: [
                    {
                        key: 'ttcr_l2_read',
                        name: 'Read'
                    },
                    {
                        key: 'ttcr_l2_write',
                        name: 'Read and Write'
                    },
                ]
            },
            {
                id: 'ttcr_anlz',
                title: 'Analyzes',
                description: 'Analyze and control staff work, efficiency',
                origins: [
                    {
                        key: 'ttcr_anlz_read',
                        name: 'Read'
                    },
                    {
                        key: 'ttcr_anlz_write',
                        name: 'Read and Write'
                    },
                ]
            },
            {
                id: 'ttcr_rprt',
                title: 'Reports',
                description: 'Staff salary report and others',
                origins: [
                    {
                        key: 'ttcr_rprt_read',
                        name: 'Read'
                    },
                    {
                        key: 'ttcr_rprt_write',
                        name: 'Read and Write'
                    },
                ]
            },
            {
                id: 'ttcr_qr',
                title: 'QR Code',
                description: 'Create, View and Remove Punch QR Codes',
                origins: [
                    {
                        key: 'ttcr_qr_write',
                        name: 'Read and Write'
                    },
                ]
            },
            {
                id: 'ttcr_pro',
                title: 'Pro Control',
                description: 'Designations, Pro Settings Access',
                origins: [
                    {
                        key: 'ttcr_pro_read',
                        name: 'Read'
                    },
                    {
                        key: 'ttcr_pro_write',
                        name: 'Read and Write'
                    },
                ]
            },
        ]
    },
    {
        id: 'slur',
        title: 'Sales App v1.1',
        description: 'Manage Lead, Enquiry and Installation',
        sections: [
            {
                id: 'slur_lead',
                title: 'Lead',
                description: 'Handle leads approval and rejection',
                origins: [
                    {
                        key: 'slur_lead_write',
                        name: 'Read and Write'
                    }
                ]
            },
            {
                id: 'slur_eqr',
                title: 'Enquiry',
                description: 'Quotation build, Enquiry form submit, Approval and reject enquiries',
                origins: [
                    {
                        key: 'slur_eqr_write',
                        name: 'Read and Write'
                    }
                ]
            },
            {
                id: 'slur_gdwn',
                title: 'Godown',
                description: 'Approve product assembling',
                origins: [
                    {
                        key: 'slur_gdwn_write',
                        name: 'Read and Write'
                    }
                ]
            },

        ]
    },
    {
        id: 'PR',
        title: 'Purifier',
        description: 'Manage purifier services',
        sections: [
            {
                id: 'PR_Service',
                title: 'Purifier Service',
                description: 'Purifier service technician default access',
                origins: [
                    {
                        key: 'PR_Service',
                        name: 'Read and Write'
                    }
                ]
            },
            {
                id: 'PR_Admin',
                title: 'Purifier Controller',
                description: 'Purifier service controller default access',
                origins: [
                    {
                        key: 'PR_Admin',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'WH',
        title: 'Whole house',
        description: 'Manage Whole house services',
        sections: [
            {
                id: 'WH_Service',
                title: 'Whole house Service',
                description: 'Whole house service technician default access',
                origins: [
                    {
                        key: 'WH_Service',
                        name: 'Read and Write'
                    }
                ]
            },
            {
                id: 'WH_Admin',
                title: 'Whole house Controller',
                description: 'Whole house service controller default access',
                origins: [
                    {
                        key: 'WH_Admin',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'Sales',
        title: 'Sales application',
        description: 'Manage sales application',
        sections: [
            {
                id: 'Sales',
                title: 'Sales',
                description: 'Salesman default access',
                origins: [
                    {
                        key: 'Sales',
                        name: 'Read and Write'
                    }
                ]
            },
            {
                id: 'SalesPro',
                title: 'Sales Pro',
                description: 'Sales application controller default access',
                origins: [
                    {
                        key: 'SalesPro',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'Installation',
        title: 'Installation',
        description: 'Manage Installation application',
        sections: [
            {
                id: 'Installation',
                title: 'Installation',
                description: 'Installation default access',
                origins: [
                    {
                        key: 'Installation',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'ControlNex',
        title: 'ControlNex',
        description: 'Manage ControlNex application',
        sections: [
            {
                id: 'ControlNex',
                title: 'ControlNex',
                description: 'Customer account managing access',
                origins: [
                    {
                        key: 'ControlNex',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'Customer',
        title: 'Customer Info',
        description: 'Manage ControlNex mini application',
        sections: [
            {
                id: 'Customer_Info',
                title: 'Customer mini app',
                description: 'Read customer accounts and details',
                origins: [
                    {
                        key: 'Customer_Info',
                        name: 'Read'
                    }
                ]
            }
        ]
    },
    {
        id: 'Accountant',
        title: 'Accountant App',
        description: 'Manage alliance finance',
        sections: [
            {
                id: 'Accountant',
                title: 'Finance CRUD',
                description: 'Control alliance finance credit and debit',
                origins: [
                    {
                        key: 'Accountant',
                        name: 'Read and Write'
                    }
                ]
            }
        ]
    },
    {
        id: 'accr',
        title: 'Accountant App v1.1',
        description: 'Manage alliance finance',
        sections: [
            {
                id: 'accr_slprd',
                title: 'Sales',
                description: 'Handle product bill and warranty',
                origins: [
                    {
                        key: 'accr_slprd_write',
                        name: 'Read and Write'
                    }
                ]
            },
        ]
    }
]