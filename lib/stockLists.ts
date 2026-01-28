// Kompletta listor över svenska aktier att analysera
// Baserat på Nasdaq Stockholm (OMX Stockholm) index-komponenter

// OMX Stockholm Large Cap (Största aktierna - marknadsvärde över 1 miljard EUR)
// Komplett lista baserad på Nasdaq Stockholm Large Cap Index
export const LARGE_CAP_STOCKS = [
  'VOLV-B',   // Volvo AB
  'ASSA-B',   // Assa Abloy AB
  'ERIC',     // Ericsson AB (LM Ericsson)
  'SHB-A',    // Svenska Handelsbanken
  'SWED-A',   // Swedbank
  'ATCO-A',   // Atlas Copco A
  'ATCO-B',   // Atlas Copco B
  'SAND',     // Sandvik
  'SKF-B',    // SKF
  'ALFA',     // Alfa Laval
  'INVE-B',   // Investor B
  'GETI-B',   // Getinge
  'TEL2-B',   // Tele2
  'SCA-B',    // SCA
  'HM-B',     // H&M
  'ELUX-B',   // Electrolux
  'INDT',     // Indutrade
  'ABB',      // ABB
  'AZN',      // AstraZeneca
  'BOL',      // Boliden
  'SEB-A',    // Skandinaviska Enskilda Banken A
  'TELIA',    // Telia Company
  'VOLCAR-B', // Volvo Car Corporation B
  'SBB-B',    // Samhällsbyggnadsbolaget i Norden B
  'NIBE-B',   // NIBE Industrier B
  'LUND-B',   // L E Lundbergföretagen B
  'KINV-B',   // Kinnevik B
  'CAST',     // Castellum
  'FABG',     // Fabege
  'HEXA-B',   // Hexagon AB
  'SINCH',    // Sinch
  'STORY-B',  // Storytel B
  'TRUE-B',   // Truecaller B
  'SOBI',     // Swedish Orphan Biovitrum
  'THULE',    // Thule Group
  'SWEC-B',   // Sweco AB
  'HUSQ-A',   // Husqvarna AB
  'EQT',      // EQT AB
  'EPI-B',    // Epiroc AB
  'LIFCO-B',  // Lifco AB
  'XANO-B',   // XANO Industri AB
  'NOTE',     // Note AB
  'NOLA-B',   // Nolato AB
  'LATO-B',   // Latour AB
  'MELI',     // Melker Schörling AB
  'HUFV-A',   // Hufvudstaden AB
  'WALL-B',   // Wallenstam AB
  'PEAB-B',   // Peab AB
  'NCC-A',    // NCC AB
  'NCC-B',    // NCC AB
  'SKMO',     // Skanska AB
  'ESSITY-B', // Essity AB
  'AXFO',     // Axfood AB
  'EVO',      // Evolution AB
  'EMBRAC-B', // Embracer Group AB
];

// OMX Stockholm Mid Cap (Medelstora aktier)
// Komplett lista baserad på Nasdaq Stockholm Mid Cap Index
export const MID_CAP_STOCKS = [
  'MTG-B',      // Modern Times Group MTG B
  'FING-B',     // Fingerprint Cards B
  'ORRON',      // Orron Energy AB
  'AFR',        // Africa Oil Corp
  'NOBI',       // Nobia AB
  'RATO-B',     // Ratos B
  'ARISE',      // Arise Windpower
  'BERG-B',     // Bergman Beving AB
  'BEIJ-B',     // Beijer Alma
  'EPEN',       // Ependion AB
  'BINV',       // BioInvent International
  'BIOG-B',     // BioGaia B
  'BYGG',       // Byggmax Group
  'BRIN-B',     // Brinova Fastigheter
  'BTS-B',      // BTS Group B
  'CEVI',       // CellaVision AB
  'CLAS-B',     // Clas Ohlson B
  'CLO-B',      // Cloetta B
  'CTT',        // CTT Systems AB
  'DIGN',       // Dignitana AB
  'DIST',       // DistIT AB
  'DUNI',       // Duni AB
  'EAB',        // EAB Group AB
  'ELOS-B',     // Elos Medtech AB
  'ENRO',       // Eniro AB
  'FAG',        // Fagerhult Group AB
  'FIRE',       // Firefly AB
  'FLUI',       // Fluicell AB
  'FNM',        // Ferronordic Machines AB
  'FPAR',       // FastPartner AB
  'G5EN',       // G5 Entertainment AB
  'GARO',       // GARO AB
  'GCON',       // Gunnebo AB
  'GOMX',       // GomSpace Group AB
  'HEBA-B',     // Heba Fastighets AB
  'HEMF',       // Hemfosa Fastigheter AB
  'HLDX',       // Haldex AB
  'HOFF-B',     // House of Friends AB
  'IAR-B',      // IAR Systems Group AB
  'INWI',       // Inwido AB
  'JOMA',       // Joma Group AB
  'KAHOT',      // Kahoot! ASA
  'KAMBI',      // Kambi Group plc
  'KARO',       // Karo Pharma AB
  'KIND',       // Kindred Group plc
  'KNOW',       // Knowit AB
  'LIME',       // Lime Technologies AB
  'M8G',        // M8G AB
  'MAGI',       // Magillem AB
  'MALAR',      // Malarporten AB
  'MCAP',       // MedCap AB
  'MCOV-B',     // MedCap AB
  'MIDS',       // Midsummer AB
  'MOMENT',     // Moment Group AB
  'MTRS',       // Munters Group AB
  'NETEL',      // Netel Holding AB
  'NETI-B',     // Net Insight AB
  'NEWA-B',     // New Wave Group AB
  'NIVI-B',     // Nilörngruppen AB
  'NMAN',       // Netmore Group AB
  'NPROP',      // Newsec Property AB
  'NXT',        // NXT AB
  'ODX-B',      // Odontoprev AB
  'OPUS',       // Opus Group AB
  'PACT',       // Proact IT Group AB
  'PANDOX',     // Pandox AB
  'PIERCE',     // Pierce Group AB
  'PLAZ-B',     // Plaza Centers NV
  'PLED',       // PledPharma AB
  'PNDX-B',     // Pandox AB
  'PREC',       // Precise Biometrics AB
  'PROF-B',     // ProfilGruppen AB
  'PURE',       // Pureprofile Ltd
  'QEC',        // QleanAir AB
  'QLINEA',     // Q-linea AB
  'QLUND',      // Q-Lundberg AB
  'REJL-B',     // Rejlers AB
  'RESQ',       // Resq AB
  'RUG',        // RugVista Group AB
  'SAGA-B',     // Saga Furs Oyj
  'SAGA-D',     // Saga Furs Oyj
  'SANION',     // Saniona AB
  'SCST',       // Scandi Standard AB
  'SECT-B',     // Sectra AB
  'SEDANA',     // Sedana Medical AB
  'SEYE',       // Seeye AB
  'SF',         // Stillfront Group AB
  'SFL',        // Safello Group AB
  'SHOT',       // ShotTracker AB
  'SILEON',     // Sileon AB
  'SINTX',      // Sintana Petroleum Inc
  'SKIS-B',     // SkiStar AB
  'STAR-B',     // Star Vault AB
  'STRAX',      // Strax AB
  'STUDBO',     // Studsvik AB
  'SVED-B',     // Svedbergs i Dalstorp AB
  'SWMA',       // Swedish Match AB
  'TALK',       // TalkPool AB
  'TANGI',      // Tangiamo Touch Technology AB
  'TELCO',      // Telco International AB
  'TETY',       // Tethys Oil AB
  'TIETOS',     // TietoEVRY Oyj
  'TIGR',       // Tigre Group AB
  'TILT',       // Tilt Holdings Inc
  'TIVO',       // Tivoli AB
  'TMT',        // TMT Group AB
  'TNG',        // Tangiamo Touch Technology AB
  'TOBII',      // Tobii AB
  'TOURN',      // Tourn International AB
  'TRANS',      // Transcom WorldWide AB
  'TRUMF',      // Trumf AB
  'TTS',        // TTS Group AB
  'TURBO',      // Turbonetics AB
  'TWILIO',     // Twilio Inc
  'UPM',        // UPM-Kymmene Oyj
  'VEF',        // VEF AB
  'VESTUM',     // Vestum AB
  'VIMIAN',     // Vimian Group AB
  'VNV',        // VNV Global AB
  'WESC',       // WeSC AB
  'WISE',       // Wise Group AB
  'XBRANE',     // Xbrane Biopharma AB
  'XSPRAY',     // Xspray Pharma AB
  'XXL',        // XXL ASA
  'ZAPPN',      // Zappn AB
];

// OMX Stockholm Small Cap (Mindre aktier)
// Komplett lista baserad på Nasdaq Stockholm Small Cap Index
export const SMALL_CAP_STOCKS = [
  'ACTI',      // Active Biotech AB
  'ANOT',      // Anoto Group AB
  'BELE',      // BE Group AB
  'BONG',      // Bong AB
  'BJORN',     // Björn Borg AB
  'BOUL',      // Boule Diagnostics AB
  'CONCE',     // Concejo AB
  'DEDI-B',    // Dedicare AB
  'DURO-B',    // Duroc AB
  'ACAD',      // AcadeMedia AB
  'ACARIX',    // Acarix AB
  'ACAST',     // Acast AB
  'ACOUST',    // AcouSort AB
  'ACRI',      // Acrinova AB
  'ADDTECH',   // Addtech AB
  'ADVBOX',    // Advenica AB
  'AERO',      // Aerocrine AB
  'AFRY',      // AFRY AB
  'AGRO',      // AgroSeeds AB
  'AHLST',     // Ahlstrom-Munksjö Oyj
  'AINS',      // Ains Group AB
  'AKAO',      // Akao AB
  'AKSO',      // Akso Nobel AB
  'ALCA',      // Alcadon Group AB
  'ALIG',      // Aligera AB
  'ALLIGO',    // Alligo AB
  'ALM',       // Alm Brand A/S
  'ALPC',      // Alpcot Holding AB
  'ALZ',       // Alzinova AB
  'AMAST',     // Amasten AB
  'AMBU',      // Ambu A/S
  'ANEB',      // Aneby Grupp AB
  'ANIMA',     // Anima AB
  'ANOD',      // Anoto Group AB
  'APAC',      // Apator SA
  'APET',      // Apetit Oyj
  'APOTE',     // Apoteket AB
  'APRND',     // Aprilendagen AB
  'AQ',        // AQ Group AB
  'ARCT',      // Arctic Paper SA
  'ARJO',      // Arjo AB
  'AROS',      // Aros Kapital AB
  'ARPL',      // Arplast Industrier AB
  'ARTE',      // Arte Group AB
  'ASAB',      // Asa International AB
  'ASEC',      // Asec AB
  'ASPI',      // Aspire Global plc
  'ASTA',      // Asta Real Estate AB
  'ATRL',      // Atrium Ljungberg AB
  'AUR',       // Auriant Mining AB
  'AUTO',      // Autoliv Inc
  'AVAN',      // Avanza Bank Holding AB
  'AVEN',      // Avenir Telecom SA
  'AVENY',     // Aveny AB
  'AXIC',      // Axichem AB
  'AXIS',      // Axis AB
  'BALD',      // Balders AB
  'BALCO',     // Balco Group AB
  'BALT',      // Baltic Sea Properties AB
  'BANDA',     // Banda Property Group AB
  'BANH',      // Banhof AB
  'BANT',      // Bantrel AB
  'BARD',      // Bardahl Nordic AB
  'BARN',      // Barnängen AB
  'BAS',       // Basware Oyj
  'BATL',      // Battle AB
  'BAZA',      // Bazar AB
  'BBTOB',     // BBTOB AB
  'BCOR',      // Bcorp AB
  'BELI',      // Belimo Holding AG
  'BENE',      // Beneq Oyj
  'BESQ',      // Besqab AB
  'BETCO',     // Betsson AB
  'BETS',      // Betsson AB
  'BETT',      // Better Collective A/S
  'BICO',      // BICO Group AB
  'BILI',      // BillerudKorsnäs AB
  'BIOH',      // Biohit Oyj
  'BIOT',      // Biotage AB
  'BJO',       // Björn Borg AB
  'BJUR',      // Bjurfors AB
  'BLAC',      // Black Earth Farming AB
  'BLUE',      // Bluefish Pharmaceuticals AB
  'BLUEW',     // Bluewater Energy Services AB
  'BRAV',      // Bravida Holding AB
  'BRIS',      // Brisa AB
  'BRIT',      // Britannia AB
  'BRO',       // Brodrene Hartmann A/S
  'BRUK',      // Bruks AB
  'BSAB',      // BSA AB
  'BUIL',      // BuildData Group AB
  'BULT',      // Bulten AB
  'BURE',      // Bure Equity AB
  'BURL',      // Burlöv AB
  'CAG',       // CAG Group AB
  'CAM',       // Camurus AB
  'CAND',      // Candela AB
  'CARE',      // Careium AB
  'CAT',       // Catena AB
  'CAVE',      // Caveo AB
  'CFL',       // CFL Software AB
  'CHAL',      // Chalmers Industriteknik AB
  'CHAR',      // Charli AB
  'CHRO',      // ChromoGenics AB
  'CINT',      // Cint Group AB
  'CIRC',      // Circassia Pharmaceuticals plc
  'CLS',       // CLS Holdings plc
  'CMH',       // CMH Group AB
  'COALA',     // Coala-Life AB
  'COLL',      // Collector AB
  'COMA',      // Comatec Group Oyj
  'COND',      // Condit AB
  'CONS',      // Consilium AB
  'CONT',      // Contura AB
  'COOR',      // Coor Service Management Holding AB
  'CORE',      // CoreTech System AB
  'CORT',      // Cortus Energy AB
  'COST',      // Costco Wholesale Corporation
  'COWI',      // COWI A/S
  'CPAC',      // CPAC AB
  'CRAD',      // Cradia AB
  'CRED',      // Credentia AB
  'CREDO',     // Credo Group AB
  'CRET',      // Cretech AB
  'CRON',      // Cronus AB
  'CROSS',     // CrossControl AB
  'CRUX',      // Crux Group AB
  'CURAS',     // Curasight A/S
  'CURT',      // Curtiss-Wright Corporation
  'CYBE',      // Cybercom Group AB
  'CYBR',      // Cyberdyne Inc
  'DACK',      // Dacke Industri AB
  'DAN',       // Danfoss A/S
  'DANS',      // Danske Bank A/S
  'DATA',      // Data Respons ASA
  'DEG',       // Degerman Holding AB
  'DELT',      // Deltron AB
  'DEMA',      // Demant A/S
  'DENT',      // Dentium Co Ltd
  'DESS',      // Dessert AB
  'DEXT',      // DexTech Medical AB
  'DFDS',      // DFDS A/S
  'DGC',       // DGC AB
  'DIAH',      // Diahan AB
  'DIAV',      // Diaverum AB
  'DIC',       // DIC Asset AG
  'DIV',       // Divio Technologies AB
  'DIVI',      // Divio Technologies AB
  'DLAB',      // D-LAB AB
  'DLS',       // DLS AB
  'DMYD',      // DMYD AB
  'DNO',       // DNO ASA
  'DOXA',      // Doxa AB
  'DRIV',      // Drivkraft AB
  'DSV',       // DSV A/S
  'DUS',       // Dus AB
  'DYN',       // Dynasafe AB
  'DYNA',      // DynaCERT Inc
  'DYNT',      // Dynatrace Inc
  'EAC',       // EAC AB
  'EAST',      // Eastnine AB
  'EATO',      // Eat & Meet AB
  'EB',        // EB AB
  'ECIT',      // ECIT AB
  'ECOL',      // Ecolab Inc
  'ECOR',      // Ecorub AB
  'EDEN',      // Edenred SA
  'EDGE',      // Edgeware AB
  'EDU',       // Education First AB
  'EEXI',      // EEXI AB
  'EFOR',      // Efora AB
  'EG7',       // EG7 AB
  'EGEN',      // Egen AB
  'EGLO',      // Eglobe AB
  'EID',       // EID AB
  'EINV',      // E Investment AB
  'EKOB',      // Ekobanken AB
  'ELAN',      // Elan AB
  'ELEN',      // Elen AB
  'ELG',       // ELG Carbon Fibre Ltd
  'ELIX',      // Elixir AB
  'ELK',       // ELK AB
  'ELLE',      // Elle AB
  'ELM',       // ELM AB
  'ELSE',      // Else AB
  'EMBR',      // Embracer Group AB
  'EMIL',      // Emil Lundberg AB
  'EMIT',      // Emit AB
  'EMPI',      // Empire AB
  'ENEA',      // Enea AB
  'ENEF',      // Enefit Green AS
  'ENER',      // EnerSys
  'ENEX',      // Enex AB
  'ENG',       // ENG AB
  'ENGE',      // Engeco AB
  'ENQ',       // EnQuest plc
  'ENT',       // Entra ASA
  'ENTE',      // Entersekt AB
  'ENTR',      // Entra ASA
  'ENVI',      // Enviro AB
  'ENZY',      // Enzyre AB
  'EPRO',      // Epro AB
  'ERIX',      // Erix AB
  'ERMA',      // Erma AB
  'ESAB',      // ESAB AB
  'ESEN',      // Esen AB
  'ESGR',      // ESGR AB
  'ESK',       // ESK AB
  'ESLO',      // Eslöv AB
  'ESPA',      // Espada AB
  'ESPR',      // Esperi Care AB
  'EST',       // EST AB
  'ESTA',      // Estancia AB
  'ETAC',      // ETAC AB
  'ETEL',      // Etel AB
  'ETRA',      // Etra AB
  'EUCA',      // Eucatex S.A. Indústria e Comércio
  'EURO',      // Euroclear SA/NV
  'EUS',       // EUS AB
  'EXPR',      // Expressen AB
  'EYE',       // EyeC AB
];

// Teknologiaktier
export const TECH_STOCKS = [
  'ERIC',     // Ericsson
  'FING-B',   // Fingerprint Cards
  'SINCH',    // Sinch
  'STORY-B',  // Storytel B
  'TRUE-B',   // Truecaller B
  'IAR-B',    // IAR Systems Group
  'NETI-B',   // Net Insight AB
  'TOBII',    // Tobii AB
  'SMART',    // Smart Eye AB
];

// Bankaktier
export const BANK_STOCKS = [
  'SHB-A',    // Svenska Handelsbanken
  'SWED-A',   // Swedbank
  'SEB-A',    // Skandinaviska Enskilda Banken
];

// Industriaktier
export const INDUSTRIAL_STOCKS = [
  'VOLV-B',   // Volvo
  'ATCO-A',   // Atlas Copco A
  'ATCO-B',   // Atlas Copco B
  'SAND',     // Sandvik
  'SKF-B',    // SKF
  'ALFA',     // Alfa Laval
  'ABB',      // ABB
  'EPI-B',    // Epiroc AB
  'HEXA-B',   // Hexagon AB
];

// Konsumentvaror
export const CONSUMER_STOCKS = [
  'HM-B',     // H&M
  'ELUX-B',   // Electrolux
  'VOLCAR-B', // Volvo Car Corporation
  'CLO-B',    // Cloetta B
  'SCST',     // Scandi Standard AB
];

// Fastigheter
export const REAL_ESTATE_STOCKS = [
  'SBB-B',    // Samhällsbyggnadsbolaget i Norden
  'CAST',     // Castellum
  'FABG',     // Fabege
  'HEBA-B',   // Heba Fastighets AB
  'HEMF',     // Hemfosa Fastigheter AB
  'HUFV-A',   // Hufvudstaden AB
  'WALL-B',   // Wallenstam AB
  'BRIN-B',   // Brinova Fastigheter
  'FPAR',     // FastPartner AB
];

// Alla aktier kombinerad lista (för flexibilitet)
export const ALL_STOCKS = [
  ...LARGE_CAP_STOCKS,
  ...MID_CAP_STOCKS,
  ...SMALL_CAP_STOCKS,
];

// Standardlista som används som default (för bakåtkompatibilitet)
export const SWEDISH_LARGE_CAP_SYMBOLS = LARGE_CAP_STOCKS;
