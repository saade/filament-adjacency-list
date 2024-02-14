<?php

return [
    'actions' => [
        'add' => [
            'label' => 'Adicionar item',
            'modal' => [
                'heading' => 'Adicionar item',
                'actions' => [
                    'create' => 'Criar',
                ],
            ],
        ],

        'add-child' => [
            'label' => 'Adicionar filho',
            'modal' => [
                'heading' => 'Adicionar filho',
                'actions' => [
                    'create' => 'Criar',
                ],
            ],
        ],

        'edit' => [
            'label' => 'Editar',
            'modal' => [
                'heading' => 'Editar item',
                'actions' => [
                    'save' => 'Salvar',
                ],
            ],
        ],

        'delete' => [
            'label' => 'Deletar',
            'modal' => [
                'heading' => 'Deletar item',
                'actions' => [
                    'confirm' => 'Confirmar',
                ],
            ],
        ],

        'toggle-children' => [
            'label' => 'Mostrar/esconder filhos',
        ],

        'reorder' => [
            'label' => 'Clique e arraste para reordenar',
        ],

        'indent' => [
            'label' => 'Indentar',
        ],

        'dedent' => [
            'label' => 'Desindentar',
        ],

        'moveUp' => [
            'label' => 'Mover para cima',
        ],

        'moveDown' => [
            'label' => 'Mover para baixo',
        ],
    ],

    'items' => [
        'empty' => 'Nenhum item.',
        'label' => 'Título',
        'untitled' => 'Item sem título',
    ],
];
