<?php

return [
    'actions' => [
        'add' => [
            'label' => 'افزودن آیتم',
            'modal' => [
                'heading' => 'افزودن آیتم',
                'actions' => [
                    'create' => 'ایجاد',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'افزودن زیرمجموعه',
            'modal' => [
                'heading' => 'افزودن زیرمجموعه',
                'actions' => [
                    'create' => 'ایجاد',
                ],
            ],
        ],

        'edit' => [
            'label' => 'ویرایش',
            'modal' => [
                'heading' => 'ویرایش آیتم',
                'actions' => [
                    'save' => 'ذخیره',
                ],
            ],
        ],

        'delete' => [
            'label' => 'حذف',
            'modal' => [
                'heading' => 'حذف آیتم',
                'actions' => [
                    'confirm' => 'تایید',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'نمایش/پنهان کردن زیرمجموعه‌ها',
        ],

        'reorder' => [
            'label' => 'برای مرتب‌سازی کلیک کرده و بکشید',
        ],
    ],

    'items' => [
        'empty' => 'آیتمی وجود ندارد.',
        'label' => 'عنوان',
        'untitled' => 'آیتم بدون عنوان',
    ],
];
