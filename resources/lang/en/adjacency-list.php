<?php

return [
    'actions' => [
        'add' => [
            'label' => 'Add item',
            'modal' => [
                'heading' => 'Add item',
                'actions' => [
                    'create' => 'Create',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'Add child',
            'modal' => [
                'heading' => 'Add child',
                'actions' => [
                    'create' => 'Create',
                ],
            ],
        ],

        'edit' => [
            'label' => 'Edit',
            'modal' => [
                'heading' => 'Edit item',
                'actions' => [
                    'save' => 'Save',
                ],
            ],
        ],

        'delete' => [
            'label' => 'Delete',
            'modal' => [
                'heading' => 'Delete item',
                'actions' => [
                    'confirm' => 'Confirm',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'Toggle children',
        ],

        'reorder' => [
            'label' => 'Click and drag to reorder',
        ],
    ],

    'items' => [
        'empty' => 'No items.',
        'label' => 'Label',
        'untitled' => 'Untitled item',
    ],
];
