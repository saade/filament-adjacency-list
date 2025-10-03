<?php

return [
    'actions' => [
        'add' => [
            'label' => 'Dodaj element',
            'modal' => [
                'heading' => 'Dodaj element',
                'actions' => [
                    'create' => 'Dodaj',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'Dodaj podelement',
            'modal' => [
                'heading' => 'Dodaj podelement',
                'actions' => [
                    'create' => 'Dodaj',
                ],
            ],
        ],

        'edit' => [
            'label' => 'Edytuj',
            'modal' => [
                'heading' => 'Edytuj element',
                'actions' => [
                    'save' => 'Zapisz',
                ],
            ],
        ],

        'delete' => [
            'label' => 'Usuń',
            'modal' => [
                'heading' => 'Usuń element',
                'actions' => [
                    'confirm' => 'Potwierdź',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'Przełącz podelementy',
        ],

        'reorder' => [
            'label' => 'Kliknij i przeciągnij, aby zmienić kolejność',
        ],
    ],

    'items' => [
        'empty' => 'Brak elementów.',
        'label' => 'Etykieta',
        'untitled' => 'Element bez tytułu',
    ],
];
