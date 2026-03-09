import { BsBackpack, BsEnvelopeAt, BsFacebook, BsInstagram, BsLinkedin, BsPatchCheck, BsPinMap, BsPinterest, BsTwitter } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

export const locations = [
    {
        image:'/images/joel-rohland-ON5qDh2m-Ro-unsplash.jpg',
        big:true,
        name:'Gran Canaria',
        featured:true,
        spots:['Pozo Izquierdo','Bahía de Formas']
    },
    {
        image:'/images/cities/lina-bob-anCPcwhCQ28-unsplash.jpg',
        big:false,
        name:'Tenerife',
        featured:true,
        spots:['El Médano']
    },
    {
        image:'/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
        big:false,
        name:'Fuerteventura',
        featured:true,
        spots:['Sotavento','Matas Blancas','Costa Calma','Risco del Paso']
    },
    {
        image:'/images/spots/almanarre.png',
        big:false,
        name:'South of France',
        featured:true,
        spots:['Gruissan','Almanarre']
    },
    {
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        big:true,
        name:'Tarifa, Cádiz',
        featured:true,
        spots:['Balneario','Campo','Agua','Arte Vida','Valdevaqueros','Paloma Baja']
    },
    {
        image:'/images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg',
        big:false,
        name:'Garda Lake',
        featured:true,
        spots:['Torbole']
    },
    {
        image:'/images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg',
        big:false,
        name:'Crete',
        featured:true,
        spots:['Falasarna','Elafonisi']
    },
    {
        image:'/images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg',
        big:false,
        name:'Maui, Hawaii',
        featured:true,
        spots:['Hookipa']
    },
    {
        image:'/images/switzerland.png',
        big:true,
        name:'Switzerland',
        featured:true,
        spots:['Flüelen','Isleten','Zug','Sisikon','Sempach','Silvaplana']
    },
]
export const spots = [
    {
        id:1,
        slug:'gran-canaria/pozo-izquierdo',
        image:'/images/IMG_2058.jpeg',
        featured:true,
        title:'Pozo Izquierdo',
        desc:'The iconic bump and jump spot in the Canary Islands.',
        loction:'Gran Canaria, Spain',
        rentalPlace: true,
        tag:'Advanced Spot',
        windguruForecastId:'36048'
    },
    {
        id:12,
        slug:'gran-canaria/bahia-de-formas',
        image:'/images/spots/IMG_1185.jpeg',
        featured:false,
        title:'Bahía de Formas',
        desc:'Flat water speed paradise',
        loction:'Gran Canaria, Spain',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'49346'
    },
    {
        id:2,
        slug:'tenerife/el-medano',
        image:'/images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg',
        featured:true,
        title:'El Médano',
        desc:'Year-round trade wind mecca at the foot of Montaña Roja.',
        loction:'Tenerife, Spain',
        rentalPlace:false,
        tag:'Real Estate',
        windguruForecastId:'1279560',
        windguruLiveStationId:'14924'
    },
    {
        id:3,
        slug:'central-switzerland/fluelen',
        image:'/images/spots/isleten.jpg',
        featured:true,
        title:'Flüelen',
        desc:'Foehn wind spot on the shores of Lake Uri.',
        loction:'Flüelen, Uri, Switzerland',
        rentalPlace:false,
        tag:'Weddings',
        windguruForecastId:'620377',
        windguruLiveStationId:'772'
    },
    {
        id:4,
        slug:'south-of-france/gruissan',
        image:'/images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg',
        featured:true,
        title:'Gruissan',
        desc:'Shallow lagoon and open-sea spots powered by the Tramontane wind.',
        loction:'Gruissan, France',
        rentalPlace:false,
        tag:'Restaurant',
        windguruForecastId:'242',
        windguruLiveStationId:'14601'
    },
    {
        id:5,
        slug:'south-of-france/almanarre',
        image:'/images/spots/almanarre.png',
        featured:true,
        title:'Almanarre',
        desc:'Long sandy beach with flat water and Mistral-driven side-shore wind.',
        loction:'Hyères, France',
        rentalPlace:false,
        tag:'Education',
        windguruForecastId:'501010'
    },
    {
        id:6,
        slug:'garda-lake/torbole',
        image:'/images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg',
        featured:true,
        title:'Torbole',
        desc:'Alpine lake with reliable Ora and Peler thermal winds.',
        loction:'Garda Lake, Italy',
        rentalPlace:false,
        tag:'Showroom',
        windguruForecastId:'49192',
        windguruLiveStationId:'1202'
    },
    {
        id:11,
        slug:'fuerteventura/sotavento',
        image:'/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
        featured:true,
        title:'Sotavento',
        desc:'World-class freestyle and speed spot on Fuerteventura\'s south coast.',
        loction:'Fuerteventura, Spain',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'559365',
        windguruLiveStationId:'373'
    },
    {
        id:28,
        slug:'fuerteventura/matas-blancas',
        image:'/images/spots/matas-blancas-fuerteventura.png',
        featured:false,
        title:'Matas Blancas',
        desc:'Flat water speed strip on Fuerteventura\'s southeast coast.',
        loction:'Fuerteventura, Spain',
        rentalPlace:false,
        tag:'Speed Spot',
        windguruForecastId:'53632',
        windguruLiveStationId:'3428'
    },
    {
        id:29,
        slug:'fuerteventura/costa-calma',
        image:'/images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg',
        featured:false,
        title:'Costa Calma',
        desc:'Popular freestyle and freeride spot on Fuerteventura\'s south coast.',
        loction:'Fuerteventura, Spain',
        rentalPlace:false,
        tag:'Freestyle',
        windguruForecastId:'206998'
    },
    {
        id:30,
        slug:'fuerteventura/risco-del-paso',
        image:'/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
        featured:false,
        title:'Risco del Paso',
        desc:'Shallow lagoon with flat water and steady trade winds near Sotavento.',
        loction:'Fuerteventura, Spain',
        rentalPlace:false,
        tag:'Freestyle',
        windguruForecastId:'207001',
        windguruLiveStationId:'373'
    },
    {
        id:10,
        slug:'crete/falasarna',
        image:'/images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg',
        featured:false,
        title:'Falasarna',
        desc:'Sandy Meltemi paradise on the northwest tip of Crete.',
        loction:'Crete, Greece',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'49269'
    },
    {
        id:17,
        slug:'central-switzerland/isleten',
        image:'/images/spots/isleten.jpg',
        featured:false,
        title:'Isleten',
        desc:'Foehn wind spot on Lake Uri in central Switzerland.',
        loction:'Isenthal, Uri, Switzerland',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'988948'
    },
    {
        id:18,
        slug:'central-switzerland/zug',
        image:'/images/spots/louis-droege-k6rwCx5oAS8-unsplash.jpg',
        featured:false,
        title:'Zug',
        desc:'Thermal winds on Lake Zug in central Switzerland.',
        loction:'Zug, Switzerland',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'57008'
    },
    {
        id:19,
        slug:'central-switzerland/sisikon',
        image:'/images/spots/isleten.jpg',
        featured:false,
        title:'Sisikon',
        desc:'Foehn wind spot on the eastern shore of the Urnersee.',
        loction:'Uri, Switzerland',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'57010'
    },
    {
        id:15,
        slug:'central-switzerland/sempach',
        image:'/images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg',
        featured:false,
        title:'Sempach',
        desc:'Thermal and Bise winds on Lake Sempach in central Switzerland.',
        loction:'Sempach, Lucerne, Switzerland',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'905886',
        windguruLiveStationId:'2223'
    },
    {
        id:14,
        slug:'crete/elafonisi',
        image:'/images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg',
        featured:false,
        title:'Elafonisi',
        desc:'Pink-sand lagoon with Meltemi winds on Crete\'s southwest coast.',
        loction:'Crete, Greece',
        rentalPlace:false,
        tag:'Fitness',
        windguruForecastId:'49268',
        windguruLiveStationId:'4122'
    },
    {
        id:20,
        slug:'cadiz/balneario',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Balneario',
        desc:'Mediterranean-side spot with flat water speed runs and hollow waves in Levante.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'Advanced Spot',
        windguruForecastId:'43',
        windguruLiveStationId:'2667'
    },
    {
        id:21,
        slug:'cadiz/campo',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Campo',
        desc:'Flat water paradise with a 2 km speed strip along Los Lances beach.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'Speed Spot',
        windguruForecastId:'43',
        windguruLiveStationId:'2667'
    },
    {
        id:22,
        slug:'cadiz/agua',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Agua',
        desc:'Less offshore than Campo with a shorter beach walk and a small bar for infrastructure.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'All-round Spot',
        windguruForecastId:'43',
        windguruLiveStationId:'2667'
    },
    {
        id:23,
        slug:'cadiz/arte-vida',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Arte Vida',
        desc:'Beautiful Poniente spot with short car-to-water distance and stunning scenery.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'Poniente Spot',
        windguruForecastId:'43',
        windguruLiveStationId:'2667'
    },
    {
        id:24,
        slug:'cadiz/valdevaqueros',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Valdevaqueros',
        desc:'Go-to Poniente spot with onshore waves, slalom conditions and beach lifestyle.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'Wave Spot',
        windguruForecastId:'48772',
        windguruLiveStationId:'269'
    },
    {
        id:25,
        slug:'cadiz/paloma-baja',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        featured:false,
        title:'Paloma Baja',
        desc:'Last spot in the bay with wave protection from the dune and Poniente acceleration.',
        loction:'Tarifa, Cádiz',
        rentalPlace:false,
        tag:'All-round Spot',
        windguruForecastId:'43',
        windguruLiveStationId:'2667'
    },
    {
        id:26,
        slug:'maui/hookipa',
        image:'/images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg',
        featured:true,
        title:'Hookipa',
        desc:'The world\'s most famous wave sailing spot on Maui\'s north shore.',
        loction:'Maui, Hawaii',
        rentalPlace:false,
        tag:'Wave Spot',
        windguruForecastId:'26144',
        windguruLiveStationId:'5931'
    },
    {
        id:27,
        slug:'central-switzerland/silvaplana',
        image:'/images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg',
        featured:false,
        title:'Silvaplana',
        desc:'Maloja wind funnelling through the Engadin valley onto Lake Silvaplana.',
        loction:'Engadin, Switzerland',
        rentalPlace:false,
        tag:'Freestyle',
        windguruForecastId:'1584'
    },

]

export const reviewData = [
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`Absolutely love Advertize! whenever I'm in need of finding a job, Advertize is my #1 go to! wouldn't look anywhere else.`,
        image:'/img/team-1.jpg',
        name:'Aman Diwakar',
        position:'General Manager'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`Overall, the Advertize application is a powerful tool for anyone in the job market. Its reliability, extensive job listings, and user-friendly..`,
        image:'/img/team-2.jpg',
        name:'Ridhika K. Sweta',
        position:'CEO of Agreeo'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`I love this Advertize app. it's more legit than the other ones with advertisement. Once I uploaded my resume, then employers...`,
        image:'/img/team-3.jpg',
        name:'Shushil Kumar Yadav',
        position:'Brand Manager'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image:'/img/team-4.jpg',
        name:'Ritika K. Mishra',
        position:'HR Head at Google'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image:'/img/team-5.jpg',
        name:'Shree K. Patel',
        position:'Chief Executive'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"One of the Superb Platform"',
        desc:`Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image:'/img/team-6.jpg',
        name:'Sarwan Kumar Patel',
        position:'Chief Executive'
    },
]

export const resourcesData = [
    {
        id:1,
        slug:'how-to-read-a-wind-forecast',
        image:'/images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg',
        title:'How to Read a Wind Forecast',
        desc:'Understanding wind models, GFS vs ECMWF, and how to interpret Windguru forecasts for your next session.',
        date:'15th Jan 2026',
        tag:'Forecast'
    },
    {
        id:2,
        slug:'choosing-the-right-sail-size',
        image:'/images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg',
        title:'Choosing the Right Sail Size',
        desc:'A practical guide to matching sail size with wind strength, rider weight, and board type.',
        date:'2nd Feb 2026',
        tag:'Gear'
    },
    {
        id:3,
        slug:'lake-vs-ocean-windsurfing',
        image:'/images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg',
        title:'Lake Windsurfing vs Ocean Windsurfing',
        desc:'Key differences between lake and ocean sailing — from wind patterns to gear choices and safety considerations.',
        date:'18th Feb 2026',
        tag:'Tips'
    },
    {
        id:4,
        slug:'understanding-thermal-winds',
        image:'/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
        title:'Understanding Thermal Winds',
        desc:'How thermal winds work, where they are most reliable, and how to plan your sessions around them.',
        date:'5th Mar 2026',
        tag:'Forecast'
    },
    {
        id:5,
        slug:'windsurfing-in-strong-levante',
        image:'/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        title:'Windsurfing in Strong Levante',
        desc:'Tips and safety advice for sailing Tarifa in strong Levante conditions — gear, spot choice, and hazards.',
        date:'10th Mar 2026',
        tag:'Tips'
    },
    {
        id:6,
        slug:'wave-sailing-basics',
        image:'/images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg',
        title:'Wave Sailing Basics',
        desc:'From reading the lineup to timing your jibes on the wave face — an intro to wave riding.',
        date:'20th Mar 2026',
        tag:'Technique'
    },
    {
        id:7,
        slug:'the-mistral-a-windsurfers-best-friend',
        image:'/images/spots/almanarre.png',
        title:'The Mistral: A Windsurfer\'s Best Friend',
        desc:'Everything about the Mistral wind — when it blows, where to sail it, and what to expect.',
        date:'1st Apr 2026',
        tag:'Forecast'
    },
    {
        id:8,
        slug:'planning-a-windsurf-trip-to-greece',
        image:'/images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg',
        title:'Planning a Windsurf Trip to Greece',
        desc:'Best islands, Meltemi season, gear rental options, and spot recommendations for the Greek islands.',
        date:'15th Apr 2026',
        tag:'Travel'
    },
    {
        id:9,
        slug:'foehn-wind-explained',
        image:'/images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg',
        title:'Foehn Wind Explained',
        desc:'What causes the foehn, how to spot it in the forecast, and the best Swiss lake spots for foehn sessions.',
        date:'25th Apr 2026',
        tag:'Forecast'
    },
]

export const blogData = [
    {
        id:1,
        image:'/img/blog-2.jpg',
        title:'10 Must-Have Bootstrap Templates for Modern Web Design',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'13th Sept 2025',
        views:'12k Views'
    },
    {
        id:2,
        image:'/img/blog-3.jpg',
        title:'Top 5 Bootstrap Themes for E-commerce Websites.',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'29th Nov 2025',
        views:'33k Views'
    },
    {
        id:3,
        image:'/img/blog-4.jpg',
        title:'The Ultimate Guide to Customizing Bootstrap Templates',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'13th March 2025',
        views:'15k Views'
    },
    {
        id:4,
        image:'/img/blog-5.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'5th May 2025',
        views:'12k Views'
    },
    {
        id:5,
        image:'/img/blog-6.jpg',
        title:'Creating Stunning Landing Pages with Bootstrap: Best Practices',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'19th June 2025',
        views:'33k Views'
    },
    {
        id:6,
        image:'/img/blog-1.jpg',
        title:'The Benefits of Using Bootstrap for Your Web Development Projects',
        desc:"Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date:'20th June 2025',
        views:'15k Views'
    },
]

export const footerLink1  = ['About ListingHub','Submit Listing']

export const footerLink2  = ['Trust & Safety','Investor Relations','Terms of Services','Paid Advertising','ListingHub Blog']

export const footerLink3  = ['Trust & Safety','Investor Relations','Terms of Services','Paid Advertising','ListingHub Blog']

export const categoryData = [
    {
        image:'/img/cats/catt-1.jpg',
        icon:BsBackpack,
        title:'Showroom',
        list:'103 Lists'
    },
]

export const workData = [
    {
        icon:BsPinMap,
        title:'Find Your Dream Place',
        desc:'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.'
    },
    {
        icon:BsEnvelopeAt,
        title:'Contact Listing Owners',
        desc:'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.'
    },
    {
        icon:BsPatchCheck,
        title:'Make Your Reservation',
        desc:'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.'
    },
]
export const counterData = [
    {
        number:145,
        symbol:'K',
        title:'Daily New Visitors'
    },
    {
        number:670,
        symbol:'',
        title:'Active Listings'
    },
    {
        number:22,
        symbol:'',
        title:'Won Awards'
    },
    {
        number:642,
        symbol:'K',
        title:'Happy Customers'
    },
]

export const teamData = [
    {
        image:'/img/team-1.jpg',
        name:'Julia F. Mitchell',
        position:'Chief Executive'
    },
    {
        image:'/img/team-2.jpg',
        name:'Maria P. Thomas',
        position:'Co-Founder'
    },
    {
        image:'/img/team-3.jpg',
        name:'Willa R. Fontaine',
        position:'Field Manager'
    },
    {
        image:'/img/team-4.jpg',
        name:'Rosa R. Anderson',
        position:'Business Executive'
    },
    {
        image:'/img/team-5.jpg',
        name:'Jacqueline J. Miller',
        position:'Account Manager'
    },
    {
        image:'/img/team-6.jpg',
        name:'Oralia R. Castillo',
        position:'Writing Manager'
    },
    {
        image:'/img/team-7.jpg',
        name:'Lynda W. Ruble',
        position:'Team Manager'
    },
]
export const mostViewBlog = [
    {
        image:'/img/blog-2.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        date:'13th Sept 2025'
    },
    {
        image:'/img/blog-3.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        date:'29th Nov 2025'
    },
    {
        image:'/img/blog-4.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        date:'13th March 2025'
    },
    {
        image:'/img/blog-5.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        date:'5th May 2025'
    },
    {
        image:'/img/blog-6.jpg',
        title:'Top 10 Free Bootstrap Templates for Your Next Project',
        date:'19th June 2025'
    },
]

export const blogTag = ['Job','Web Design','Development','Figma','Photoshop','HTML']

export const blogSocial = [
    BsFacebook,BsTwitter,BsInstagram,BsPinterest,BsLinkedin
]

export const articles = [
    {
        title:'What are Favorites?',
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title:'How Do I Add Or Change My Billing Details?',
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title:'How do I change my username?',
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title:'How do I change my email address?',
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title:`I'm not receiving the verification email`,
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title:'How do I change my password?',
        desc:`"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
]

export const faqData1 = [
    {
        id:'collapseOne',
        title:'How to Meet ListingHub Directory Agents?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseTwo',
        title:'Can I see Property Visualy?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseThree',
        title:'Can We Sell it?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseFour',
        title:'Can We Customized it According me?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseFive',
        title:'Can We Get Any Extra Services?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]
export const faqData2 = [
    {
        id:'collapseOne2',
        title:'Can We Refund it Within 7 Days?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseTwo2',
        title:'Can We Pay Via PayPal Service?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseThree2',
        title:'Will You Accept American Express Card?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseFour2',
        title:'Will You Charge Monthly Wise?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseFive2',
        title:'Can We Get Any Extra Services?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]
export const faqData3 = [
    {
        id:'collapseOne3',
        title:'Realcout Agent Can Chat Online?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseTwo3',
        title:'Can I Call Agent on Site?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id:'collapseThree3',
        title:'Is This Collaborate with Oyo?',
        desc:`In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]
