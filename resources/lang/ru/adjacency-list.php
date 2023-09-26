<?php

return [
    'actions' => [
        'add' => [
            'label' => 'Добавить элемент',
            'modal' => [
                'heading' => 'Добавить элемент',
                'actions' => [
                    'create' => 'Создать',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'Добавить подпункт',
            'modal' => [
                'heading' => 'Добавить подпункт',
                'actions' => [
                    'create' => 'Создать',
                ],
            ],
        ],

        'edit' => [
            'label' => 'Редактировать',
            'modal' => [
                'heading' => 'Редактировать элемент',
                'actions' => [
                    'save' => 'Сохранить',
                ],
            ],
        ],

        'delete' => [
            'label' => 'Удалить',
            'modal' => [
                'heading' => 'Удалить элемент',
                'actions' => [
                    'confirm' => 'Подтвердить',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'Сменить подпункт',
        ],

        'reorder' => [
            'label' => 'Кликните и тащите для сортировки',
        ],
    ],

    'items' => [
        'empty' => 'Нет элементов.',
        'label' => 'Лейбл',
        'untitled' => 'Неизвестный элемент',
    ],
];
