import { BsFacebook, BsInstagram, BsLinkedin, BsPinterest, BsTwitter } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

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
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg',
        title:'How to Read a Wind Forecast',
        desc:'Learn how to read Windguru, compare GFS and ECMWF wind models, and understand wind direction, gusts, and swell to plan your windsurf sessions with confidence.',
        date:'2026-01-15',
        tag:'Forecast',
        content: [
            'Reading a wind forecast correctly is probably the single most important skill a windsurfer can develop off the water. A good forecast read saves you from flat-water disappointments and puts you on the water when conditions are firing. The two most popular tools for windsurfers are Windguru and Windy, and both pull data from numerical weather models — primarily GFS and ECMWF.',
            'GFS (Global Forecast System) is the American model. It updates every 6 hours and is free, which is why most forecast sites default to it. It has a resolution of about 25 km and is generally reliable up to 3-4 days out. Beyond that, accuracy drops quickly. ECMWF (European Centre for Medium-Range Weather Forecasts) is the European model. It runs at a finer resolution, updates twice daily, and is widely considered the more accurate of the two — especially for medium-range forecasts of 5-7 days. However, it is behind a paywall on many platforms.',
            'When you look at a Windguru table, the key rows to focus on are wind speed, wind gusts, and wind direction. Wind speed tells you the average expected force. Gusts tell you how much variation to expect — a big gap between the two means gusty, less comfortable conditions. Wind direction determines whether your spot will work: an offshore wind at your beach might mean perfect side-shore conditions at another spot 20 km away.',
            'Beyond wind, pay attention to swell data if you are wave sailing. Swell height, period, and direction tell you whether waves will be present and rideable. A 1.5 m swell at 12 seconds from the northwest is very different from a 1.5 m swell at 6 seconds from the south — the former produces clean, spaced-out waves, while the latter is messy chop.',
            'A practical tip: always compare at least two models before committing to a session. If GFS says 20 knots and ECMWF says 12, the truth is probably somewhere in between — but lean toward ECMWF if you have to pick one. Also check the forecast trend over multiple updates: if each new run keeps increasing the wind, conditions are likely converging toward a stronger day.',
        ],
    },
    {
        id:2,
        slug:'choosing-the-right-sail-size',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg',
        title:'Choosing the Right Sail Size',
        desc:'A practical guide to matching your windsurf sail size with wind speed, rider weight, and board volume. Includes a sail size chart and tips for building your quiver.',
        date:'2026-02-02',
        tag:'Gear',
        content: [
            'Choosing the right sail size is one of the most common decisions a windsurfer faces before every session. Too big and you will be overpowered, exhausted, and at risk. Too small and you will struggle to plane, spending the session slogging back and forth. The right call depends on three main factors: wind speed, your body weight, and the board you are riding.',
            'As a rough starting point, a 75 kg rider on a freeride board will be comfortable on a 7.0 m sail in 15-18 knots, a 6.0 in 18-22 knots, a 5.3 in 22-27 knots, and a 4.7 in 27-33 knots. Lighter riders can shift one size down; heavier riders one size up. These ranges assume flat water or moderate chop — in waves, you typically go one size smaller for maneuverability.',
            'Board volume matters too. A higher-volume freeride board generates more lift, so it planes earlier and lets you use a slightly smaller sail for the same wind. A low-volume wave board needs more power to get going, but once planing, a smaller sail keeps it loose and responsive.',
            'When building a quiver, most recreational windsurfers do well with three sails that cover the full range of their local conditions. For a central European lake sailor, that might be 7.5, 6.0, and 4.7. For someone sailing Tarifa year-round, 5.7, 5.0, and 4.2 could cover most days. The key is minimizing gaps — if you find yourself constantly between two sizes, you probably need an intermediate option.',
            'One last consideration: mast compatibility. Most sails are designed for a specific mast length (400, 430, 460 cm). Building your quiver around sails that share a mast saves money and simplifies your gear bag. Check the sail specifications for recommended mast length and IMCS (Indexed Mast Curve Specification) before buying.',
        ],
    },
    {
        id:3,
        slug:'lake-vs-ocean-windsurfing',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg',
        title:'Lake Windsurfing vs Ocean Windsurfing',
        desc:'Explore the key differences between lake and ocean windsurfing — from wind patterns and wave conditions to gear selection, safety, and the unique challenges of each environment.',
        date:'2026-02-18',
        tag:'Tips',
        content: [
            'Lake and ocean windsurfing might look the same from a distance, but once you are on the water, they feel like entirely different sports. The wind, the water state, the gear, and even the safety considerations change significantly depending on whether you are on a Swiss alpine lake or the Atlantic coast of Fuerteventura.',
            'Wind patterns differ fundamentally. Ocean spots tend to get synoptic winds — large-scale weather systems like trade winds or the Levante that blow consistently for hours or days. Lakes, especially in mountainous areas, are dominated by thermal winds. These are driven by temperature differences between land and water: the land heats up in the afternoon, air rises, and cooler air from the lake rushes in to fill the gap. Thermals are less predictable and often come in cycles, with lulls and gusts following a rhythm tied to the terrain.',
            'Water state is the other major difference. The ocean has swell — waves generated by distant storms that arrive as organized sets. Even on a calm day, you can have a meter of groundswell rolling through. Lakes have chop: short, steep waves generated by local wind. Chop can be surprisingly challenging — it is irregular, closely spaced, and punchy. But it never has the power or push of ocean swell, which means wave riding on lakes is limited.',
            'Gear choices reflect these differences. Ocean sailors often ride smaller, more maneuverable boards (wave boards, freestyle wave) because the swell provides lift and the consistent wind lets them stay powered. Lake sailors tend toward larger freeride boards with more volume, which helps them plane through lulls and carry speed over chop. Sail sizes overlap, but lake sailors may bring a wider quiver to handle the rapid wind shifts.',
            'Safety is different too. On the ocean, currents, tides, and shore break are real hazards. Being swept downwind can mean a long swim. On a lake, the shore is never far, but cold water (especially in alpine lakes) and sudden storms — particularly the infamous thunderstorms that build over mountains in the afternoon — pose their own risks. Always check the local weather warnings and know the lake-specific danger signs.',
        ],
    },
    {
        id:4,
        slug:'understanding-thermal-winds',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
        title:'Understanding Thermal Winds',
        desc:'Learn how thermal winds develop, which conditions create the strongest sea breezes, and how to time your windsurf sessions around thermal cycles at lake and coastal spots.',
        date:'2026-03-05',
        tag:'Forecast',
        content: [
            'Thermal winds are the unsung heroes of windsurfing. While synoptic weather systems get all the attention in forecasts, thermals quietly power some of the best and most reliable sessions around the world — from the Ora del Garda on Lake Garda to the sea breezes of Almanarre and the afternoon thermals on Swiss lakes.',
            'The mechanism is straightforward: the sun heats the land faster than the water. As the land warms, the air above it rises, creating a low-pressure zone. Cooler, denser air over the water flows in to replace it — and that horizontal flow is the thermal wind you feel at the beach. This is why thermals are an afternoon phenomenon: they need several hours of solar heating to develop.',
            'The strength of a thermal depends on the temperature gradient. A hot, sunny day with cool water produces the strongest thermals. This is why Mediterranean coasts in summer, where air temperatures hit 35°C but the sea is still 20°C, produce powerful sea breezes of 15-25 knots. Conversely, overcast days or spots where the water is warm suppress thermals because the temperature difference is too small.',
            'Terrain amplifies thermals dramatically. Valleys funnel the wind, accelerating it through narrow gaps. Lake Garda is the textbook example: the long, narrow valley channels the Ora into a reliable 15-20 knot wind at Torbole nearly every summer afternoon. Mountains behind coastal spots have a similar effect — the heated slopes create additional updrafts that strengthen the onshore flow.',
            'Timing your session around thermals takes practice. As a rule, expect the wind to start building around midday, peak between 2-5 PM, and die off as the sun gets low. Arrive early to rig and be ready when the wind fills in. If the thermal is late, check for high clouds or a weak synoptic gradient that might be suppressing it. And always have a plan for the wind dying — thermals can switch off quickly when a cloud passes over.',
        ],
    },
    {
        id:5,
        slug:'windsurfing-in-strong-levante',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
        title:'Windsurfing in Strong Levante',
        desc:'Essential tips for windsurfing Tarifa and Cadiz in strong Levante wind conditions — spot selection, gear advice, safety hazards, and what makes this easterly wind unique.',
        date:'2026-03-10',
        tag:'Tips',
        content: [
            'The Levante is an easterly wind that funnels through the Strait of Gibraltar, and when it is strong, it transforms the coast of Cadiz into one of the most intense windsurfing playgrounds in Europe. Sustained winds of 30-50 knots are not uncommon, and the conditions can shift from challenging to dangerous within a short distance along the coast.',
            'Understanding Levante geography is key. The wind accelerates through the narrow strait between Spain and Morocco, creating the strongest conditions near Tarifa. As you move northwest up the coast toward Valdevaqueros, Bolonia, and Cadiz, the wind gradually loses intensity but remains strong. The Levante also creates a distinctive wave pattern: short, steep wind swell that can stack up quickly in exposed spots.',
            'Spot selection in strong Levante is critical. Valdevaqueros is the classic choice — the dune provides partial shelter at the launch, and the bay gives you room to sail. Hurricane Hotel (Playa de los Lances) can be dangerously strong and gusty. Further north, spots like Arte Vida and Balneario offer more protection and are better suited for intermediate riders. If the Levante is extreme (40+ knots), consider Bolonia or even the flat-water spots around the Baelo Claudia ruins, which sit in a relative wind shadow.',
            'Gear choices in strong Levante lean small. A 4.0-4.7 sail is typical for most riders. Use a wave board or a compact freestyle wave board — the short chop and strong gusts make large freeride boards unmanageable. Make sure your kit is in top condition: check downhaul tension, outhaul settings, and harness lines before going out. A broken line or a popped cam in 40 knots of Levante is a serious problem.',
            'Safety deserves extra attention. The Levante pushes you offshore on most of the Tarifa-facing beaches. If you lose your gear, you are swimming toward Morocco, not back to the beach. Always sail with a buddy, tell someone on shore your plan, and consider wearing a GPS tracker or carrying a phone in a waterproof pouch. Watch for kiteboarders too — in strong Levante, the launch zones get crowded and collisions become a real risk.',
        ],
    },
    {
        id:6,
        slug:'wave-sailing-basics',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg',
        title:'Wave Sailing Basics',
        desc:'An introduction to wave windsurfing — from reading the lineup and catching your first wave to timing bottom turns and jibes on the wave face. Gear tips included.',
        date:'2026-03-20',
        tag:'Technique',
        content: [
            'Wave sailing is often described as the ultimate expression of windsurfing. It combines everything — speed, power, timing, and the raw unpredictability of the ocean. But getting started in waves can feel intimidating, especially if you have spent most of your time on flat water or lake chop. The good news is that the transition is gradual, and even small waves add a completely new dimension to your sailing.',
            'Reading the lineup is the first skill to develop. Before you even launch, spend ten minutes watching the waves from the shore. Notice where they break, how often sets arrive, and whether there is a channel — a deeper section where waves do not break — that you can use to get out and back in safely. Most wave spots have a rhythm: a set of 3-5 larger waves followed by a lull. Time your exits during the lulls.',
            'Getting out through the break is the first real challenge. Keep your speed up, point slightly upwind, and absorb the whitewash with bent legs. If a wave is about to break right in front of you, bear off downwind and try to punch through the shoulder rather than taking it head-on. The key is momentum — hesitation stalls you, and stalling in the impact zone is where things go wrong.',
            'Once outside, the fun begins. To catch a wave, sail parallel to the shore and watch over your shoulder for an approaching set. As a wave reaches you, bear off downwind and sheet in — you want to match the wave speed and drop into the face. Your first rides will be simple: riding down the face and pulling out before the wave closes out. As you gain confidence, you can start doing bottom turns — carving along the base of the wave and redirecting back up the face.',
            'Gear for wave sailing is different from freeride. Wave boards are shorter (70-95 liters for most riders), narrower, and have more rocker — the curved shape that lets them ride the wave face without catching a rail. Sails are smaller, lighter, and have fewer battens for quick response. If you are just getting started, a freestyle-wave board is a great middle ground: it handles waves well but is still comfortable in flat water when the swell dies.',
        ],
    },
    {
        id:7,
        slug:'the-mistral-a-windsurfers-best-friend',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/almanarre.png',
        title:'The Mistral: A Windsurfer\'s Best Friend',
        desc:'Everything windsurfers need to know about the Mistral wind — how it forms, when and where it blows strongest, the best spots in southern France, and how to read Mistral forecasts.',
        date:'2026-04-01',
        tag:'Forecast',
        content: [
            'The Mistral is a cold, dry, northwesterly wind that blows through the Rhone valley and fans out across the Mediterranean coast of France. For windsurfers, it is one of the most reliable and powerful wind systems in Europe — capable of delivering 30-50 knot days that can last anywhere from a single afternoon to a full week.',
            'The Mistral forms when a high-pressure system sits over the Bay of Biscay or western France and a low-pressure system develops over the Gulf of Genoa or northern Italy. The pressure gradient drives cold air from the north down through the Rhone valley, where the terrain acts like a funnel, accelerating the wind dramatically. By the time it reaches the coast, the Mistral can be 10-15 knots stronger than the general synoptic wind.',
            'The prime Mistral spots are clustered around the Var and Bouches-du-Rhone departments. Almanarre, near Hyeres, is the most famous — a long, shallow lagoon that produces flat water on the inside and small waves on the outside. Gruissan, further west near Narbonne, catches the Tramontane (the Mistral\'s cousin that blows through the Aude valley) and offers a huge shallow bay perfect for speed runs. Leucate and Port-Saint-Louis are other popular options.',
            'Forecasting the Mistral is relatively straightforward compared to thermal winds. Look for the classic synoptic setup: high pressure to the west, low to the east, and a strong north-south pressure gradient across France. The ECMWF model handles Mistral events well. Once the pattern establishes, the wind is remarkably consistent — it blows all day, often all night, and can persist for 3-7 days. The first and last days of a Mistral episode tend to be the most gusty; the middle days are steadier.',
            'One thing to prepare for: the Mistral is cold. Even in summer, a strong Mistral drops air temperatures significantly and the wind chill on the water is fierce. A good wetsuit (4/3 or even 5/3 outside of July-August), booties, and gloves are worth packing even if the forecast shows sunny skies. The combination of cold wind and physical effort from sailing in 30+ knots can drain your energy faster than you expect.',
        ],
    },
    {
        id:8,
        slug:'planning-a-windsurf-trip-to-greece',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg',
        title:'Planning a Windsurf Trip to Greece',
        desc:'Plan your windsurf holiday in Greece with this guide to the best islands, Meltemi wind season, gear rental options, top spots, and practical tips for traveling with windsurf equipment.',
        date:'2026-04-15',
        tag:'Travel',
        content: [
            'Greece is one of the best windsurf destinations in the world, and the reason is one word: Meltemi. This strong northerly wind blows across the Aegean Sea every summer, funneling between the islands and creating consistent, powerful conditions from June through September. Combined with crystal-clear water, warm temperatures, and affordable prices, Greece is hard to beat for a windsurf trip.',
            'The Meltemi season typically starts building in mid-June and peaks in July and August. During peak season, you can expect 4-6 days of strong wind per week, with speeds commonly in the 20-30 knot range. The wind usually builds from late morning, peaks in the early afternoon, and fades by evening. September brings lighter, more variable conditions but also fewer crowds and lower prices.',
            'The most popular windsurf islands are Naxos, Paros, Karpathos, Lemnos, and Rhodes. Naxos offers the widest range of conditions — from the flat-water lagoon at Mikri Vigla to the wave spot at Plaka. Karpathos is the power station: Gun Bay (Afiartis) delivers some of the strongest and most consistent wind in the Mediterranean, but it is not for beginners. Paros and Lemnos are great all-rounders with multiple spots and good infrastructure.',
            'Traveling with your own gear to Greece is doable but not always practical. Most airlines charge 50-100 EUR each way for board bags, and inter-island ferries can be tricky with large equipment. The good news is that rental stations at the major spots are well-equipped with recent gear. Stations like Flisvos in Naxos, Pro Center Karpathos, and the clubs in Paros offer daily and weekly packages. Reserve in advance during July-August — the best gear goes fast.',
            'Practical tips: book accommodation near your chosen spot, as Greek island roads can be slow and parking at popular beaches fills up. Rent a car or ATV for flexibility. Eat at the local tavernas — the food is excellent and cheap. And build in at least one rest day per week — Meltemi sessions are physically demanding, and the combination of wind, sun, and saltwater will wear you down faster than you think. Use the rest day to explore the island, swim, or just enjoy the Greek pace of life.',
        ],
    },
    {
        id:9,
        slug:'foehn-wind-explained',
        image:'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg',
        title:'Foehn Wind Explained',
        desc:'Understand the foehn wind phenomenon — what causes it, how to recognize it in weather forecasts, and the best Swiss and Austrian lake spots for epic foehn windsurf sessions.',
        date:'2026-04-25',
        tag:'Forecast',
        content: [
            'The foehn is a warm, dry wind that occurs on the lee side of mountain ranges. In central Europe, it is most famously associated with the Alps: moist air from the south hits the mountains, rises, cools, drops its moisture as rain on the Italian side, then descends into the Swiss and Austrian valleys as a dramatically warmed and dried wind. The result is some of the most spectacular windsurfing conditions on European lakes.',
            'Foehn events are driven by a specific synoptic pattern: a low-pressure system approaching from the west or southwest, combined with a southerly flow aloft pushing moist Mediterranean air against the Alps. The stronger the pressure gradient across the alpine ridge, the stronger the foehn. Classic foehn weather arrives with a distinctive sky — crystal clear on the north side of the Alps with a sharp wall of clouds (the foehn wall) visible along the mountain crests to the south.',
            'For windsurfers, the foehn is exciting because it can produce 25-40 knots of sustained wind on lakes that are normally calm. The wind is also warm — sometimes 10-15 degrees warmer than the ambient temperature — which makes for pleasant sailing even in spring or autumn. However, foehn winds are turbulent and gusty, especially near the mountains. The wind can double in strength within minutes and create dangerous conditions for unprepared sailors.',
            'The best foehn spots are on the Swiss lakes oriented north-south, which channel the southerly wind. Urnersee (the southern arm of Lake Lucerne) is the most famous, with Fluelen and Isleten being the go-to launch spots. The narrow valley funnels the foehn into a concentrated blast. Lake Walen, Lake Zurich (upper end), and Lake Zug also catch foehn, though usually with less intensity. In Austria, the Inntal valley and lakes like Achensee are excellent.',
            'Reading foehn in the forecast requires practice. Standard wind models often underestimate foehn strength because the resolution is too coarse to capture the valley effects. Look for the synoptic setup (south flow, strong cross-alpine pressure gradient), check the foehn-specific forecasts from MeteoSwiss or ZAMG, and watch for the visual signs: the foehn wall, lenticular clouds, and a sudden rise in temperature. When all signs align, drop everything and get to the lake — foehn days are rare and precious, and they often end as abruptly as they begin.',
        ],
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

// Stub exports for unused template pages/components
/* eslint-disable @typescript-eslint/no-explicit-any */
export const articles: any[] = []
export const footerLink1: any[] = []
export const footerLink2: any[] = []
export const footerLink3: any[] = []
export const teamData: any[] = []
export const workData: any[] = []
export const categoryData: any[] = []
export const counterData: any[] = []
export const faqData1: any[] = []
export const faqData2: any[] = []
export const faqData3: any[] = []
