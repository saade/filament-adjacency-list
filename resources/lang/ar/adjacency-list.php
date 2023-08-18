<?php

return [
    'actions' => [
        'add' => [
            'label' => 'اضافة عنصر',
            'modal' => [
                'heading' => 'اضافة عنصر',
                'actions' => [
                    'create' => 'حفظ',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'اضافة عنصر فرعي',
            'modal' => [
                'heading' => 'اضافة عنصر فرعي',
                'actions' => [
                    'create' => 'حفظ',
                ],
            ],
        ],

        'edit' => [
            'label' => 'تعديل',
            'modal' => [
                'heading' => 'تعديل عنصر',
                'actions' => [
                    'save' => 'حفظ',
                ],
            ],
        ],

        'delete' => [
            'label' => 'حذف',
            'modal' => [
                'heading' => 'حذف عنصر',
                'actions' => [
                    'confirm' => 'تأكيد',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'اظهار العناصر الفرعية',
        ],

        'reorder' => [
            'label' => 'اضغط واسحب لتغيير الترتيب',
        ],
    ],

    'items' => [
        'empty' => 'لاتوجد عناصر.',
        'label' => 'العنوان',
        'untitled' => 'عنصر غير مسمى',
    ],
];
