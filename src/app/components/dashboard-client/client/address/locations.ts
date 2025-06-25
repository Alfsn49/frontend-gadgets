export type LocationData = {
  [country: string]: {
    [province: string]: string[];
  };
};

export const Locations = {
    Ecuador: {
      Azuay: [
        'Cuenca',
        'Gualaceo',
        'Paute',
        'Sigsig',
        'Girón',
        'Nabón',
        'San Fernando',
        'Santa Isabel',
        'Camilo Ponce Enríquez',
        'Chordeleg',
        'El Pan',
        'Guachapala',
        'Oña',
        'Pucará',
        'Sevilla de Oro'
      ],
      Bolívar: [
        'Guaranda',
        'Chillanes',
        'Chimbo',
        'Echeandía',
        'San Miguel',
        'Caluma',
        'Las Naves'
      ],
      Cañar: [
        'Azogues',
        'Biblián',
        'Cañar',
        'La Troncal',
        'El Tambo',
        'Déleg',
        'Suscal'
      ],
      Carchi: [
        'Tulcán',
        'Bolívar',
        'Espejo',
        'Mira',
        'Montúfar',
        'San Pedro de Huaca'
      ],
      Chimborazo: [
        'Riobamba',
        'Alausí',
        'Colta',
        'Chambo',
        'Chunchi',
        'Guamote',
        'Guano',
        'Pallatanga',
        'Penipe',
        'Cumandá'
      ],
      Cotopaxi: [
        'Latacunga',
        'La Maná',
        'Pangua',
        'Pujilí',
        'Salcedo',
        'Saquisilí',
        'Sigchos'
      ],
      El_Oro: [
        'Machala',
        'Arenillas',
        'Atahualpa',
        'Balsas',
        'Chilla',
        'El Guabo',
        'Huaquillas',
        'Las Lajas',
        'Marcabelí',
        'Pasaje',
        'Piñas',
        'Portovelo',
        'Santa Rosa',
        'Zaruma'
      ],
      Esmeraldas: [
        'Esmeraldas',
        'Atacames',
        'Eloy Alfaro',
        'Muisne',
        'Quinindé',
        'Rioverde',
        'San Lorenzo'
      ],
      Galápagos: [
        'Isabela',
        'San Cristóbal',
        'Santa Cruz'
      ],
      Guayas: [
        'Guayaquil',
        'Alfredo Baquerizo Moreno',
        'Balao',
        'Balzar',
        'Colimes',
        'Coronel Marcelino Maridueña',
        'Daule',
        'Durán',
        'El Empalme',
        'El Triunfo',
        'General Antonio Elizalde',
        'Isidro Ayora',
        'Lomas de Sargentillo',
        'Milagro',
        'Naranjal',
        'Naranjito',
        'Nobol',
        'Palestina',
        'Pedro Carbo',
        'Playas',
        'Salitre',
        'Samborondón',
        'Santa Lucía',
        'Simón Bolívar',
        'Yaguachi'
      ],
      Imbabura: [
        'Ibarra',
        'Antonio Ante',
        'Cotacachi',
        'Otavalo',
        'Pimampiro',
        'Urcuquí'
      ],
      Loja: [
        'Loja',
        'Calvas',
        'Catamayo',
        'Célica',
        'Chaguarpamba',
        'Espíndola',
        'Gonzanamá',
        'Macará',
        'Paltas',
        'Pindal',
        'Puyango',
        'Quilanga',
        'Saraguro',
        'Sozoranga',
        'Zapotillo',
        'Olmedo'
      ],
      Los_Ríos: [
        'Babahoyo',
        'Baba',
        'Buena Fe',
        'Mocache',
        'Montalvo',
        'Palenque',
        'Puebloviejo',
        'Quevedo',
        'Quinsaloma',
        'Urdaneta',
        'Valencia',
        'Ventanas',
        'Vinces'
      ],
      Manabí: [
        'Portoviejo',
        'Bolívar',
        'Chone',
        'El Carmen',
        'Flavio Alfaro',
        'Jama',
        'Jaramijó',
        'Jipijapa',
        'Junín',
        'Manta',
        'Montecristi',
        'Olmedo',
        'Paján',
        'Pedernales',
        'Pichincha',
        'Puerto López',
        'Rocafuerte',
        'San Vicente',
        'Santa Ana',
        'Sucre',
        'Tosagua',
        '24 de Mayo'
      ],
      Morona_Santiago: [
        'Macas',
        'Gualaquiza',
        'Huamboya',
        'Limón Indanza',
        'Logroño',
        'Morona',
        'Pablo Sexto',
        'Palora',
        'San Juan Bosco',
        'Santiago',
        'Sucúa',
        'Taisha',
        'Tiwintza'
      ],
      Napo: [
        'Tena',
        'Archidona',
        'Carlos Julio Arosemena Tola',
        'El Chaco',
        'Quijos'
      ],
      Orellana: [
        'Orellana',
        'Aguarico',
        'La Joya de los Sachas',
        'Loreto'
      ],
      Pastaza: [
        'Puyo',
        'Arajuno',
        'Mera',
        'Santa Clara'
      ],
      Pichincha: [
        'Quito',
        'Cayambe',
        'Mejía',
        'Pedro Moncayo',
        'Pedro Vicente Maldonado',
        'Puerto Quito',
        'Rumiñahui',
        'San Miguel de los Bancos'
      ],
      Santa_Elena: [
        'Santa Elena',
        'La Libertad',
        'Salinas'
      ],
      Santo_Domingo_de_los_Tsáchilas: [
        'Santo Domingo',
        'La Concordia'
      ],
      Sucumbíos: [
        'Nueva Loja',
        'Cascales',
        'Cuyabeno',
        'Gonzalo Pizarro',
        'Lago Agrio',
        'Putumayo',
        'Shushufindi',
        'Sucumbíos'
      ],
      Tungurahua: [
        'Ambato',
        'Baños de Agua Santa',
        'Cevallos',
        'Mocha',
        'Patate',
        'Pelileo',
        'Quero',
        'San Pedro de Pelileo',
        'Tisaleo'
      ],
      Zamora_Chinchipe: [
        'Zamora',
        'Centinela del Cóndor',
        'Chinchipe',
        'El Pangui',
        'Nangaritza',
        'Palanda',
        'Paquisha',
        'Yacuambi',
        'Yantzaza'
      ]
    }
  };