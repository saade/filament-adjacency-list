<?php

return [
    'actions' => [
        'add' => [
            'label' => 'Ajouter un élément',
            'modal' => [
                'heading' => 'Ajouter un élément',
                'actions' => [
                    'create' => 'Créer',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'Ajouter un enfant',
            'modal' => [
                'heading' => 'Ajouter un enfant',
                'actions' => [
                    'create' => 'Créer',
                ],
            ],
        ],

        'edit' => [
            'label' => 'Éditer',
            'modal' => [
                'heading' => 'Éditer l\'élément',
                'actions' => [
                    'save' => 'Sauvegarder',
                ],
            ],
        ],

        'delete' => [
            'label' => 'Supprimer',
            'modal' => [
                'heading' => 'Supprimer l\'élément',
                'actions' => [
                    'confirm' => 'Confirmer',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'Afficher/Masquer les enfants',
        ],

        'reorder' => [
            'label' => 'Cliquez et glissez pour réorganiser',
        ],
    ],

    'items' => [
        'empty' => 'Aucun élément.',
        'label' => 'Étiquette',
        'untitled' => 'Élément sans titre',
    ],
];
