const defaultState = [
  {
    category: 'Trekking',
    description:
      'Spending multiple hours on the trail, climbing around boulders, rock hopping and ascending hills gives your whole body a workout, improving your strength, agility and cardio fitness.',
    amount: 854,
    img: 'https://docs.svalbard.dev/mobiledb/trekking.jpg',
    top_title: 'The 10 best treks in the world',
    top_by: 'LONELY PLANET',
    url: 'https://www.lonelyplanet.com/articles/the-10-best-treks-in-the-world',
    top_desc:
      'These 10 classic treks are amongst the best on the planet; all of them require a sturdy pair of lungs, fit legs and a good amount of preparation. But the reward is an experience that lasts a lifetime.',
    top_paces: [
      {
        name: 'GR20',
        place: 'France',
        description:
          'This demanding 15-day (168km, 104mi) slog through Corsica is legendary for the diversity of landscapes it traverses. There are forests, granite moonscapes, windswept craters, glacial lakes, torrents, peat bogs, maquis, snow-capped peaks, plains and névés.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/GettyImages-544438349-f7dcb749721f.jpg',
      },
      {
        name: 'Inca Trail',
        place: 'Perú',
        description:
          "The 33km (20 mile) ancient trail to the hilltop citadel of Machu Picchu was laid by the Incas and brought to mainstream attention by Hiram Bingham when he 'discovered' it in 1911. In the centuries since, millions of hikers have flocked to catch a glimpse of the (not so) 'lost city', and as a consequence daily hikers on the trail were restricted to just 200 in 2018.",
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/shutterstockRF_389136313-0ec649f9a2d4.jpg',
      },
      {
        name: 'Pays Dogon',
        place: 'Mali',
        description:
          '‘The land of the Dogon people’ is one of Africa’s most breathtaking regions. A trek here can last anywhere between two and 10 days, and takes in the soaring cliffs of the Bandiagara escarpment inlaid with old abandoned cliff dwellings.',
        img:
          'https://img.traveltriangle.com/blog/wp-content/uploads/2019/01/shutterstock_398443843.jpg',
      },
      {
        name: 'Everest Base Camp',
        place: 'Nepal',
        description:
          "Reaching a height of 5,545m (18,193ft) at Kala Pattar, this two- to three-week trek is extremely popular, thanks, in part, to its spectacular scenery, but more prominently to the romanticism involved; with successful trekkers able to proudly say they've stood at the base of the world's highest mountain.",
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/shutterstockRF_667066843-a85cdad036b8.jpg',
      },
      {
        name: 'Indian Himalayas',
        place: 'India',
        description:
          'Fewer folk trek on the Indian side of the world’s greatest mountain range. So, if isolation’s your thing try trekking in Himachal Pradesh. Hardcore hikers can try teetering along the mountain tops for 24 days from Spiti to Ladakh.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/GettyRF_624202652_EDITED-a8136383e5ff.jpg',
      },
      {
        name: 'Routeburn Track',
        place: 'New Zealand',
        description:
          'See the stunning subalpine scenery of New Zealand’s South Island surrounding this medium three-day (32km, 20mi) track. At the base of New Zealand’s Southern Alps, the trail passes through two national parks: Fiordland and Mt Aspiring. Highlights include the views from Harris Saddle and atop Conical Hill – from where you can see waves breaking on the distant beach.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/shutterstockRF_367597793-7466e3fa2d79.jpg',
      },
      {
        name: 'Overland Track',
        place: 'Australia',
        description:
          'Tasmania’s prehistoric-looking wilderness is most accessible on the 80km (50mi, five- to six-day) Overland Track. Snaking its way between Cradle Mountain and Lake St Clair (Australia’s deepest natural freshwater lake), the well-defined path (boardwalked in parts) passes craggy mountains, beautiful lakes and tarns, extensive forests and moorlands.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/500pxRF_124885467-a44505709dc2.jpg',
      },
      {
        name: 'The Narrows',
        place: 'USA',
        description:
          'A 26km (16mi) journey through dramatic canyons carved over centuries by the Virgin River, the Narrows in Zion National Park is a hike like no other. The route is the river, with over half of the hike spent wading and sometimes swimming. The hike can be traversed in a day, though some choose to take the hanging gardens and natural springs at a more leisurely pace – spending a night at one of the park’s 12 camp grounds.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/GettyRF_157395539-b2137aaf9717.jpg',
      },
      {
        name: 'The Haute Route',
        place: 'France-Switzerland',
        description:
          'Leading from Chamonix in France through the southern Valais to Zermatt in Switzerland, the Haute Route traverses some of the highest and most scenic country accessible to walkers anywhere in the Alps. The summer Haute Route walk (which takes a different course than the more famous winter skitouring route) takes around two weeks to complete.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/GettyRF_699088115-1-868e279acb42.jpg',
      },
      {
        name: 'Baltoro Glacier & K2',
        place: 'Pakistan',
        description:
          'This corridor of ice leads to the colossal peak of K2 (8,611m, 28,251ft), the world’s second-highest mountain. This incomparable trek in Pakistan traverses some of the most humbling scenery on the planet. What starts with a trail following icy rivers into the guts of the Baltoro Glacier transforms into a path to the granite pyramidal mountains, including Paiju (6,610m, 21,686ft), Uli Biaho (6,417m, 21,053ft), Great Trango Tower (6,286m, 20,623ft) and ultimately K2. If the 15 days doesn’t floor you, take amazing side trips to more moraine-covered glaciers.',
        img:
          'https://lp-cms-production.imgix.net/features/2012/06/GettyRF_639126592-2bd9627d75d7.jpg',
      },
    ],
    top_experiences: [
      {
        id: 327,
        name: 'Hiking through the Rainbow Mountain',
        location: 'Cusco, Perú',
        img: 'https://docs.svalbard.dev/mobiledb/Rainbow_mountain3.jpg',
        rate_per_person: 120,
        duration: '1 day',
        group_size: 10,
        include: 'Transportation, Breakfast, Hot drinks',
        raiting: 4.84,
        raiting_count: 124,
        lat: '-13.5273641',
        lon: '-71.985854',
        categories: ['Hiking', 'Photography'],
        description:
          'A fantastic day tour (with trekking) to the 7 Color mountain, through an undiscovered land of wild desert landscapes. The Rainbow Mountain, offers a remote landscape experience immersing you with living local culture and a unique wildlife only found in these high altitude places. The Rainbow Mountain, also known as the Vinicunca is a undiscovered land full of wildly desert landscapes, snow capped glaciated peaks, herds of alpacas, and pristine beauty. This hike gets you to experience summiting a mountain over 5,100 m.',
        meeting: 'Pickup up from your hotel at 5:50 – 06:20 am',
        images: [
          'https://docs.svalbard.dev/mobiledb/Rainbow_mountain1.jpg',
          'https://docs.svalbard.dev/mobiledb/Rainbow_mountain2.jpg',
          'https://docs.svalbard.dev/mobiledb/Rainbow_mountain4.jpeg',
        ],
      },
      {
        id: 346,
        name: 'Humantay Lagoon',
        location: 'Cusco, Perú',
        img: 'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon6.jpg',
        rate_per_person: 30,
        duration: '12 hours',
        group_size: 6,
        include:
          'Hotel Transfer, 1 Breakfast, 1 lunch (vegetarian option), Professional guide',
        raiting: 4.72,
        raiting_count: 237,
        lat: '-13.5196984',
        lon: '-71.9607381',
        categories: ['Hiking', 'Photography', 'Family'],
        description:
          'A popular day trip from Cusco, Humantay Lake and its natural wonders are best experienced by hike, but navigating on your own can be challenging. This full-day guided sightseeing tour includes round-trip travel from Cusco,plus breakfast and lunch—everything is taken care of for you to enjoy your trek in full. Admire panoramic views over Apurimac River and Humantay Lake, and learn of the region’s Inca history.',
        meeting: 'Pickup up from your hotel',
        images: [
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon7.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon1.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon2.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon3.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon4.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon5.jpg',
        ],
      },
    ],
  },
  {
    category: 'Camping',
    description:
      "Camping goes a long way to improving your mood. It's all to do with serotonin, that wonderful chemical our body produces that helps to make us happy.",
    amount: 474,
    img: 'https://docs.svalbard.dev/mobiledb/Camping.jpg',
    top_title: 'Top 5 US States for Camping',
    top_by: 'TRIP SAVVY',
    url: 'https://www.tripsavvy.com/top-states-for-camping-503995',
    top_desc:
      'There are a lot of great camping and outdoor destinations across the United States — camping is abundant at national and state parks, forests, wilderness areas, and preserves. Each US state has a unique appeal for campers, but these five stand out from the rest: Colorado, Missouri, Montana, New Mexico, and New York.',
    top_paces: [
      {
        name: 'Colorado: The Centennial State',
        place: '',
        description:
          "Colorado's natural beauty, rugged mountains, and breathtaking landscape make it a top camping and outdoor destination in the United States. On a camping road trip through Colorado, you will discover mountains, lakes and streams, wildflowers, forests, and sand dunes, and rich red rock formations.",
        img:
          'https://www.outtherecolorado.com/wp-content/uploads/2019/06/iStock-996409334-1024x683.jpg',
      },
      {
        name: 'Missouri: The Show-Me State',
        place: '',
        description:
          'Missouri boasts hundreds of conservation and natural areas, 49 state parks, the vast Mark Twain National Forest, the Ozark National Scenic Riverway, and the 225-mile Katy Trail. Not to mention the numerous recreation possibilities in these areas like hunting, fishing, and boating.',
        img:
          'https://eighttofiveandinbetween.files.wordpress.com/2015/03/ozarks-float-trips_0.jpg',
      },
      {
        name: 'Montana: Big Sky Country',
        place: '',
        description:
          "It's easy to get lost exploring in Montana — the big sky, and untamed, wild, and natural land that comprises the state of Montana is breathtaking and all-consuming. With two national parks, ​Yellowstone and Glacier, and 51 state parks, you'll never be far from somewhere to pitch your tent; and outdoor recreation is abundant.​",
        img:
          'https://www.visittheusa.co/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2019-01/ea8bafb8dc579bfe0a02b529212c90dc.jpeg',
      },
      {
        name: 'New Mexico: The Land of Enchantment',
        place: '',
        description:
          'New Mexico is home to Carlsbad Caverns National Park, numerous state parks, and two historical parks. You can drive the historic US Route 66 or one of 25 scenic byways. In New Mexico, camping road trip possibilities are aplenty.',
        img:
          'https://d36tnp772eyphs.cloudfront.net/blogs/1/2018/05/shutterstock_113207065.jpg',
      },
      {
        name: 'New York: I Love NY',
        place: '',
        description:
          "New York isn't just for city dwellers. In fact, the state is home to some of the most passionate outdoors people in the United States. There are the Finger Lakes, Lake Placid, and the Hudson Valley; not to mention the Adirondacks, the Catskills, and Niagra Falls. New York is home to many natural wonders and 4 million acres of nature preserves.",
        img:
          'https://familytraveller.com/usa/wp-content/uploads/sites/2/2017/12/2017-adirondacks-1.jpg',
      },
    ],
    top_experiences: [
      {
        id: 2,
        name: 'Discover Muir Woods National Monument',
        location: 'California, US',
        img: 'https://docs.svalbard.dev/mobiledb/muirwoods.jpg',
        rate_per_person: 15,
        duration: '3 hours',
        group_size: 6,
        include: 'Transportation included',
        raiting: 4.89,
        raiting_count: 3421,
        lat: '37.8970241',
        lon: '-122.5833064',
        categories: ['Forest', 'Family'],
        description:
          "The Muir Woods National Monument is a must-see destination on any visit to the San Francisco Bay Area. Home to one of the world's last remaining coastal redwood forests, this protected nature reserve allows travelers to hike, relax, or picnic among these giant Northern California trees for an incredible experience only minutes from the city. The Muir Woods forest forms part of the Golden Gate National Recreation Area, which includes nearby outdoor attractions including Stinson Beach—the park's only lifeguarded beach—and Fort Baker, offering great views of the Golden Gate Bridge from Marin County.",
        meeting: 'We pick you up downtown San Francisco.',
        images: [
          'https://docs.svalbard.dev/mobiledb/muirwoods1.jpg',
          'https://docs.svalbard.dev/mobiledb/muirwoods2.jpeg',
          'https://docs.svalbard.dev/mobiledb/muirwoods3.jpg',
          'https://docs.svalbard.dev/mobiledb/muirwoods4.jpg',
          'https://docs.svalbard.dev/mobiledb/muirwoods5.jpg',
        ],
      },
      {
        id: 541,
        name: 'Catching the light: Expedition with Arctic Truck',
        location: 'Svalbard, Norway',
        img: 'https://docs.svalbard.dev/mobiledb/Northern_Lights3.jpg',
        rate_per_person: 130,
        duration: '4 hours',
        group_size: 6,
        include:
          'Scooter suits, mittens, shoes and facemask, Hot drink, Guide with safety gear',
        raiting: 4.74,
        raiting_count: 342,
        lat: '78.224043',
        lon: '15.6304488',
        categories: ['Winter', 'Photography', 'Night Lights'],
        description:
          'Experience the magical colors of the Aurora Borealis. Join us on snowmobiles as we head into the dark and hunt the northern lights. Our guides will use their local knowledge and experience to give you the best chances of experiencing the northern lights. This trip is an open-destination trip which means that the guide will choose the route based on weather-forecast and current conditions. Opening hours: Dec 1, 2020 – Jan 26, 2021, Daily: 10:00 AM–2:00 PM.',
        meeting: 'Pickup and drop-off at hotel',
        images: [
          'https://docs.svalbard.dev/mobiledb/Northern_Lights.jpg',
          'https://docs.svalbard.dev/mobiledb/Northern_Lights1.jpg',
          'https://docs.svalbard.dev/mobiledb/Northern_Lights2.jpg',
          'https://docs.svalbard.dev/mobiledb/Northern_Lights4.jpg',
        ],
      },
      {
        id: 557,
        name:
          'Exclusive Magical Northern Lights hunting with Njalasouka Adventures',
        location: 'Narvik, Norway',
        img: 'https://docs.svalbard.dev/mobiledb/Narvik_Lights2.jpg',
        rate_per_person: 234,
        duration: '20.00 – 23.00, about 3 hours',
        group_size: 6,
        include:
          'Transport from and to hotel, Sleighride With snowmobil, hot beverage, tripod for your camera',
        raiting: 4.71,
        raiting_count: 241,
        lat: '68.4214297',
        lon: '17.3836604',
        categories: ['Photography', 'Camping', 'Night Lights'],
        description:
          'One of the best places to take great pictures of the Northern Lights in the Narvik region, is perhaps close to the Njalasouka lavvu in the mountains of Beisfjord. While waiting for the northernLights you might see a shooting star, and you will get to feel and experience the total silence that only free nature can bring. The Polar Night in the Arctic areas is magical in its own way, but the Northern Lights can be unpredictable and you could wait for hours for it to appear.',
        meeting: 'Pick up at hotels in Narvik',
        images: [
          'https://docs.svalbard.dev/mobiledb/Narvik_Lights1.jpg',
          'https://docs.svalbard.dev/mobiledb/Narvik_Lights4.jpg',
          'https://docs.svalbard.dev/mobiledb/Narvik_Lights3.jpg',
        ],
      },
    ],
  },
  {
    category: 'Hiking',
    description:
      'Hiking is a powerful cardio workout that can: Lower your risk of heart disease. Improve your blood pressure and blood sugar levels. Boost bone density, since walking is a weight-bearing exercise.',
    amount: 914,
    img: 'https://docs.svalbard.dev/mobiledb/hiking.jpg',
    top_title: 'The 5 best places to hike in july',
    top_by: 'MACS ADVENTURE',
    url:
      'https://www.macsadventure.com/us/blog/the-5-best-places-to-walk-or-hike-in-july/',
    top_desc:
      "Each time of year offers its own particular qualities for adventure seekers, but here we focus on the best places to hike in July. This is not just a list for sunshine-seekers. We're thinking out of the box a bit here, and these trails all have their own benefits which make them perfect for exploring in July.",
    top_paces: [
      {
        name: 'July in Scotland',
        place: 'UK',
        description:
          "We'll be honest, the weather in Scotland can be a little unpredictable at any time of year! But, there's no such thing as bad weather, only bad clothes. July usually offers some of the highest temperatures, without being too extreme, making Scotland an ideal destination.",
        img:
          'https://www.macsadventure.com/walking-holidays/wp-content/uploads/2014/06/662.Walkers-on-the-West-Highland-Way.jpg',
      },
      {
        name: 'The Alps',
        place: 'Switzerland',
        description:
          'The Tour du Mont Blanc season kicks off in June, and by July the bigger snow fields should have cleared to make passage easier. This is a trek filled with superlatives, and a must do "tick off the list" once in a lifetime. There\'s no mistaking that the Tour du Mont Blanc is a challenge, but part of its beauty is that it is manageable for "non-technical" climbers (obviously with the right fitness and equipment), and you can make it a bit easier on yourself by opting for baggage transfer, or "in comfort" options with accommodation in small hotels, auberges, and refuges with private rooms.',
        img:
          'https://www.macsadventure.com/walking-holidays/wp-content/uploads/2014/06/Mel-Seale_TMB-1024x683.jpg',
      },
      {
        name: 'Walking holidays in Iceland',
        place: '',
        description:
          'The middle of summer is a wonderful time to visit Iceland. Almost 24 hour daylight makes summer in Iceland feel energised, and frankly a bit spiritual! The volcanic lanscapes, thermally heated spas, and bubbling geothermal wonders add to that feeling. Try the Laugavegur Highland Trail for a bit of a challenge, or a scenic drive and hike for an easier option.',
        img:
          'https://www.macsadventure.com/walking-holidays/wp-content/uploads/2014/06/662.shutterstock_116715160landmannalaugar.jpg',
      },
      {
        name: 'The Channel Islands',
        place: 'UK',
        description:
          'Enjoy a delightful mix of vibes as the British Seaside meets the Continental Coastline! Watch exotic flowers bloom and enjoy spectacular coastal cliffs and delightful beaches. The Channel Islands of Jersey and Guernsey both have great coastal paths perfect for walking as a week long break.',
        img:
          'https://www.macsadventure.com/walking-holidays/wp-content/uploads/2014/06/JCP3.jpg',
      },
      {
        name: 'The Canadian Rockies',
        place: 'Canada',
        description:
          'Probably better known as a winter ski destination, watch the Banff National Park blossom and allow Lake Louise to wow you with its glory by taking a walking tour in the Canadian Rockies in July. The Ultimate Canadian Rockies is our suggestion for the best way to explore this hiking mecca. There is even an area of the Banff National Park called Sunshine Meadows.',
        img:
          'https://www.macsadventure.com/walking-holidays/wp-content/uploads/2014/06/8.-for-web.jpg',
      },
    ],
    top_experiences: [
      {
        id: 346,
        name: 'Humantay Lagoon',
        location: 'Cusco, Perú',
        img: 'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon6.jpg',
        rate_per_person: 30,
        duration: '12 hours',
        group_size: 6,
        include:
          'Hotel Transfer, 1 Breakfast, 1 lunch (vegetarian option), Professional guide',
        raiting: 4.72,
        raiting_count: 237,
        lat: '-13.5196984',
        lon: '-71.9607381',
        categories: ['Hiking', 'Photography', 'Family'],
        description:
          'A popular day trip from Cusco, Humantay Lake and its natural wonders are best experienced by hike, but navigating on your own can be challenging. This full-day guided sightseeing tour includes round-trip travel from Cusco,plus breakfast and lunch—everything is taken care of for you to enjoy your trek in full. Admire panoramic views over Apurimac River and Humantay Lake, and learn of the region’s Inca history.',
        meeting: 'Pickup up from your hotel',
        images: [
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon7.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon1.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon2.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon3.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon4.jpg',
          'https://docs.svalbard.dev/mobiledb/Humantay_Lagoon5.jpg',
        ],
      },
      {
        id: 358,
        name: 'Cusco Rafting and Zipline Adventure',
        location: 'Cusco, Perú',
        img: 'https://docs.svalbard.dev/mobiledb/Rafting4.jpg',
        rate_per_person: 58,
        duration: '8 hours',
        group_size: 12,
        include: 'Rafting equipment, Wetsuit, Life-jacket & Helmet',
        raiting: 4.84,
        raiting_count: 314,
        lat: '-13.5152619',
        lon: '-71.9793133',
        categories: ['Rafting', 'River', 'Adrenaline'],
        description:
          'Embark on a thrilling outdoor adventure that combines white-water rafting with zip-lining and satisfies your need for speed. Depart Cusco for Oropesa, where you can ease your butterflies with a bite of the town’s iconic bread before hitting the Vilcanota River. Tackle Class III and IV rapids and battle intense waves as you make your way downstream, enjoying the remarkable scenery of the surrounding Andes as you go. Afterward, soar through the sky on an exhilarating zip ride.',
        meeting: 'Hotel Pickup',
        images: [
          'https://docs.svalbard.dev/mobiledb/Rafting3.jpg',
          'https://docs.svalbard.dev/mobiledb/Rafting2.jpg',
          'https://docs.svalbard.dev/mobiledb/Rafting5.jpg',
          'https://docs.svalbard.dev/mobiledb/Rafting1.jpg',
        ],
      },
      {
        id: 5,
        name: 'Hikes with spectacular Golden Gate bridge views',
        location: 'San Francisco, US',
        img: 'https://docs.svalbard.dev/mobiledb/golden2.jpg',
        rate_per_person: 32,
        duration: '3 hour',
        group_size: 12,
        include: 'English guide',
        raiting: 4.72,
        raiting_count: 49,
        lat: '37.8095848',
        lon: '-122.4749691',
        categories: ['City', 'Family', 'Hike'],
        description:
          'The Golden Gate Bridge, bathed in warm orange, spans the narrowest point between San Francisco and Marin. It is officially a “thing” to visit the bridge, take photos of the bridge, and just sit back and admire it. Maybe it is the inimitable color, sleek Art Deco style, or the chance to walk across it. In any case, it is a classic San Francisco experience. Here are six hikes to experience the bridge in all its glory.',
        meeting: 'We’ll meet on the south side of the bridge.',
        images: [
          'https://docs.svalbard.dev/mobiledb/golden1.jpg',
          'https://docs.svalbard.dev/mobiledb/goldenGate.jpg',
          'https://docs.svalbard.dev/mobiledb/golden3.jpg',
          'https://docs.svalbard.dev/mobiledb/golden4.jpg',
        ],
      },
    ],
  },
  {
    category: 'Diving',
    description:
      'The very first feeling you experience while SCUBA diving is the absolute freedom. You are freed from gravity. You feel weightless as if you are flying. After the first few SCUBA dives, you realize that you resemble more of an astronaut who is exploring a whole new planet.',
    amount: 527,
    img: 'https://docs.svalbard.dev/mobiledb/diving.jpg',
    top_title: 'Best scuba diving in the world',
    top_by: 'BLUE WATER DIVE TRAVEL',
    url: 'https://www.bluewaterdivetravel.com/best-scuba-diving-world',
    top_desc:
      'The underwater environment is vast; a rich and diverse domain where each and every dive site offers something new and unique. Selecting the best scuba diving in the world is no mean feat, but here at Bluewater Travel, our Travel Experts are equal to the task.  We have chosen 16 dive destinations that showcase the best scuba diving in the world, ranging from tropical to cold water locations and covering all four corners of the globe. We have included the top sites to encounter amazing wildlife from large pelagics to macro critters, and highlighted some once-in-a-lifetime experiences that will have you reaching for your wetsuit.',
    top_paces: [
      {
        name: 'Galapagos Islands',
        place: 'Ecuador',
        description:
          'Located 560 miles off the west coast of Ecuador, the isolated volcanic cluster of the Galapagos Islands offers an abundance of unique biodiversity, quite unlike anywhere else in the world. Both above and below the waves, nature enthusiasts will spot rare endemic species such as the marine iguanas, while divers can marvel at the wide variety of large pelagics that pass through the island’s waters in huge numbers. It’s no surprise the island chain National Park and its surrounding Marine Reserve have been designated a UNESCO World Heritage Site.',
        img: 'https://www.bluewaterdivetravel.com/images/galap-trip-2.jpg',
      },
      {
        name: 'Jardines de la Reina',
        place: 'Cuba',
        description:
          'Cuba’s Jardines de la Reina (Garden of the Queens) Marine Park is home to the largest and best-preserved coral reef system in the Caribbean. Nearly 850 sq. miles of protected waters are home to an awesome array of shark species, including silky, Caribbean reef, great hammerhead, lemon, nurse, and blacktip. Furthermore, divers are spoiled by an abundance of reef fish and over 50 species of coral and 200 species of sponge; an overwhelming plethora of life unlike anywhere else in the Caribbean. The island is also one of the few places where divers can safely get up close and personal with the American saltwater crocodile.',
        img: 'https://www.bluewaterdivetravel.com/images/Cuba17.jpg',
      },
      {
        name: 'Raja Ampat',
        place: 'Indonesia',
        description:
          'Nestled in the heart of the Indo-Pacific Coral Triangle, the remote Raja Ampat island chain celebrates the richest marine diversity in the world, making it one of our top Indonesian photography destinations. Divers are awestruck by the sheer number and variety of medium to large-size fish, as well as great macro and regular shark and manta sightings across the vibrant hard and soft coral reefs.',
        img: 'https://www.bluewaterdivetravel.com/images/raja2019-06.jpg',
      },
      {
        name: 'Dumaguete',
        place: 'Philippines',
        description:
          'Dumaguete is one of the few destinations in the world that caters to a range of interests, all at an exceptional standard.  Describing it as an ‘all-round’ dive resort does not do justice to the world-class macro, huge coral reefs, schooling jackfish, and famous whale sharks of nearby Cebu.',
        img: 'https://www.bluewaterdivetravel.com/images/atmos-report-4.jpg',
      },
      {
        name: 'Socorro Islands',
        place: 'Mexico',
        description:
          "The relatively unknown Revillagigedo Archipelago, more commonly referred to as the Socorro Islands, is unlikely to feature on most divers’ bucket-lists, however, diving here is so memorable that we couldn’t fathom leaving it off our list of favorite sites. Lying 240 miles from Cabo San Lucas on Mexico's Baja California Peninsula, the four islands that make up this UNESCO World Heritage Site are comparable to the Galapagos Islands, although they are far easier to reach. Remarkable numbers of sharks and other oceanic species school around steep walls and pinnacles rising over 3,000 ft from the ocean floor, so much so that the islands are one of our top shark diving destinations.",
        img: 'https://www.uwphotographyguide.com/images/socorro-60.jpg',
      },
      {
        name: 'French Polynesia',
        place: '',
        description:
          'Each and every dive in French Polynesia is rich and diverse, with a bounty of high caliber sites to suit all levels and interests. However, what really sets these islands apart is the concentration of world-class shark and big animal dives centered around a tiny cluster of islands to the west of the region. Often casually referred to as Tahiti, this corner of French Polynesia is home to huge numbers (some estimate millions) of at least 16 species of shark, and the islands of Rangiroa, Bora Bora, and Fakarava, a UNESCO Biosphere Reserve, are some of the best places in the world to experience them. The crystal clear waters around the islands’ lagoons and reefs afford intimate encounters with lemon, whitetip, blacktip, grey reef, and hammerhead sharks, all to a backdrop of schooling barracuda, eagle rays, dolphins, turtles, and a multitude of reef fish.',
        img: 'https://www.bluewaterdivetravel.com/images/Moorea-Erik-2.jpg',
      },
    ],
    top_experiences: [
      {
        id: 623,
        name: 'Dive with Whale Sharks',
        location: 'Ningaloo, Australia',
        img: 'https://docs.svalbard.dev/mobiledb/Whale_Shark2.jpg',
        rate_per_person: 140,
        duration: 'Full day boat-trip, from around 7:30am to 4:30pm',
        group_size: 8,
        include:
          'Underwater cameras, High quality snorkel gear and wetsuits to use, Transportation',
        raiting: 4.92,
        raiting_count: 96,
        lat: '-21.9464763',
        lon: '114.1304335',
        categories: ['Diving', 'Photography'],
        description:
          'Ningaloo Reef is 260km long and is the world’s only large reef that is positioned very close to a landmass. In fact, the reef actually protects a lagoon that is 2 - 4 metres deep on average. Ningaloo Reef is renowned for its seasonal feeding of whale sharks and its riches of marine life. As part of your Ningaloo reef diving adventure you will be treated to up to 200 species of hard corals, 50 species of soft coral and more than 520 fish species, a phenomenal offering that is due in part by the meeting of temperate and tropical marine zones.',
        meeting: 'Pickup and drop-off out the front of your accommodation',
        images: [
          'https://docs.svalbard.dev/mobiledb/Whale_Shark4.jpg',
          'https://docs.svalbard.dev/mobiledb/Whale_Shark1.jpg',
        ],
      },
      {
        id: 624,
        name: 'Wildlife and Snorkel tours',
        location: 'Exmouth, Australia',
        img: 'https://docs.svalbard.dev/mobiledb/Divign1.jpg',
        rate_per_person: 70,
        duration: '2h 30m',
        group_size: 6,
        include: 'Snorkelling equipment, Snacks',
        raiting: 4.88,
        raiting_count: 124,
        lat: '-21.9367109',
        lon: '114.1283526',
        categories: ['Diving', 'Photography'],
        description:
          'The Ningaloo Reef is one of the most popular snorkeling areas in Western Australia and a UNESCO World Heritage site. On this tour, travel by high-speed boat from Bundegi Beach and dive in to discover the underwater wonders of the reef. Stop along the way to see the Navy Pier and the SS Mildura shipwreck, look out for dolphins and sea turtles along the coast, and enjoy swimming and snorkeling amid the colorful coral gardens.',
        meeting: 'Pickup and drop-off out the front of your accommodation',
        images: [
          'https://docs.svalbard.dev/mobiledb/Divign4.jpg',
          'https://docs.svalbard.dev/mobiledb/Divign2.jpg',
          'https://docs.svalbard.dev/mobiledb/Divign6.jpg',
          'https://docs.svalbard.dev/mobiledb/Divign5.jpg',
          'https://docs.svalbard.dev/mobiledb/Divign3.jpg',
        ],
      },
    ],
  },
  {
    category: 'Skydiving',
    description:
      "It's hard to describe the sensation of looking out of the door when you're just about to jump, or freefalling through the air. The day of your first skydive will be full of new experiences.",
    amount: 154,
    img: 'https://docs.svalbard.dev/mobiledb/Skydiving.jpg',
    top_title: '5 Best Places in the World to Go Skydiving',
    top_by: 'MAKE MY TRIP',
    url: 'https://www.makemytrip.com/blog/skydiving-adventure',
    top_desc:
      'To indulge in this extreme adventure sport you have to be a risk taker, but what the experience gives you is more than you can ever imagine. The feeling of floating above the clouds and seeing the world’s beauty from a bird’s eye; you have to do it to believe it. Here are the best places in the world to go skydiving:',
    top_paces: [
      {
        name: 'Over the Swiss Alps in Interlaken',
        place: 'Switzerland',
        description:
          'Test your limits at the most extraordinary skydive spot in the world, Interlaken. From the turquoise waters of Lake Thun and Lake Brienz to the snow-capped Swiss Alps, this tandem skydive from 14,000 feet offers views like none other. Fly over Eiger, Mönch and Jungfrau peaks at a mind-boggling speed before the parachute is finally deployed.',
        img:
          'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/0f/00/18.jpg',
      },
      {
        name: 'Eco-friendly Skydive',
        place: 'Hawaii',
        description:
          'A skydiving experience in Hawaii is definitely not for the faint-hearted. You can choose from a range of altitudes between 8,000 to 22,000 feet. The diversity of views that a jump here gives is something to lookout for. You will come across Hawaii’s many islands, rainforests, mountains, beaches and more. Capture uninterrupted aerial views of the entire island at once as you transcend the skies and then jump. Wondering what’s eco-friendly about this dive? Skydive operators in Hawaii use energy efficient planes to help reduce your skydiving carbon footprint by upto 40%.',
        img:
          'https://seoimgak.mmtcdn.com/blog/sites/default/files/images/skydiving-hawaii.jpg',
      },
      {
        name: 'Across the Namib Desert',
        place: 'Namibia',
        description:
          'Here’s a one-of-its-kind experience to fuel your adventurous side. It’s not everyday that you get to gaze down at the endless expanse of a desert and the rolling sand dunes stretching to the edge of a coast. Opt for a skydiving adventure in Namibia and see all this from a height of 10,000 feet. Landing into the middle of such a landscape is something you want to tick off your bucket list right now!',
        img:
          'https://www.divergenttravelers.com/wp-content/uploads/2015/12/IMG_5706.jpg',
      },
      {
        name: 'From the Fox Glacier',
        place: 'New Zealand',
        description:
          'Think adventure, think New Zealand! While there are many spots for skydiving in the country, Fox Glacier is a must if you are an adventure junkie. Opt for a tandem skydive from 9,000, 13,000 and even 16,500 feet! You will be rewarded with the most stunning scenery, which includes a stunning 13 kilometre glacier and Mt. Cook enveloped in clouds, a view which is to die for. Fox Glacier is famed as the second most scenic skydive in the world and not without reason.',
        img:
          'https://d2o97soxyng1w1.cloudfront.net/media/images/IMG_4752.2e16d0ba.fill-800x450.jpg',
      },
      {
        name: 'Jump from Mount Everest',
        place: 'Nepal',
        description:
          'Take the leap of a lifetime as you jump out of a plane with your tandem instructor or go for a free fall from Mount Everest if you are a daredevil. This is not only the highest drop zone in the world, but also the most scenic, courtesy the views of the mighty Himalayas. An altitude of 29,500 feet makes it all the more thrilling and difficult to achieve.',
        img:
          'https://incredible-adventures.com/everest/2012-everest-skydive-23.jpg',
      },
    ],
    top_experiences: [],
  },
  {
    category: 'Biking',
    description:
      'After one or two weeks of cycling, the mitochondria in your body proliferate. They work as the energy centres of the cells, which helps you to produce energy more efficiently.',
    amount: 231,
    img: 'https://docs.svalbard.dev/mobiledb/bikeTur.jpg',
    top_title: 'Best places to cycle in Europe',
    top_by: 'THE ADVENTURE JUNKIES',
    url:
      'https://www.theadventurejunkies.com/5-best-places-to-cycle-in-europe/',
    top_desc:
      'Europe and cycling go quite well together (and the Tour de France isn’t the only reason to think so!) In many locations, bike rentals come surprisingly cheap, making cycling a fairly compelling option for tourists and travelers. If you’re traveling to Europe with cycling as a top priority – or you’re already a resident – then you’ll certainly want to try out a few of the best rides on the continent. Here, in no particular order, are our picks for the best places to cycle in Europe.',
    top_paces: [
      {
        name: 'Southwest Ireland',
        place: '',
        description:
          'While the entirety of the Emerald Isles is a long-standing having for cyclist, the Beara, Iveragh and Dingle peninsulas stand apart for their beauty and terrain. In truth, you can take your pick of roads in this region (and there’s a whole 200km stretch from Galway to Cork that’s quite nice).',
        img:
          'https://mk0theadventuregfnyq.kinstacdn.com/wp-content/uploads/Beara-Photo-Credit-mrantanas-via-Flickr-750px.jpg',
      },
      {
        name: 'Yorkshire Dales',
        place: 'UK',
        description:
          'Peddling from dale to dale in this quiet stretch of countryside can be quite a challenge. Expect a string of false flats and steep grades, making for a potentially grueling (but thoroughly enjoyable) ascent.',
        img:
          'https://mk0theadventuregfnyq.kinstacdn.com/wp-content/uploads/Yorkshire-Dales-Photo-Credit-Thomas-Jaworski-via-Flickr-750px.jpg',
      },
      {
        name: 'Belgium',
        place: '',
        description:
          'If you’re willing to take on a stretch of cobbled hills, then you may want to take on the Tour de Flanders in Belgium. If you’d like to make it a bit less official, there’s plenty of opportunity for casual exploration around Flanders. Belgium is a very bike-happy country all in all, so enjoyable rides abound.',
        img:
          'https://mk0theadventuregfnyq.kinstacdn.com/wp-content/uploads/Flanders-Photo-Credit-antoine-via-Flickr-750px.jpg',
      },
      {
        name: 'The French Alps',
        place: '',
        description:
          'Sure, the Tour de France has made the Alps into a cyclist destination, but you don’t have to be a pro to tackle the legendary terrain. Every year, thousands of amateurs flock to the Alps to traverse the same routes. While we’re on the topic of French mountain ranges, let’s not forget the Pyrenees; avoid the main valley roads and you’ll enjoy a racing terrain that’s similar to the Alps but with steeper, lower climbs.',
        img:
          'https://mk0theadventuregfnyq.kinstacdn.com/wp-content/uploads/French-Alps-Photo-Credit-will_cyclist-via-Flickr-750px.jpg',
      },
      {
        name: 'Provence',
        place: 'France',
        description:
          'If you depart from Carpentras, you’ll find easy access to the scenery and surrounding villages – as well as Mont Ventoux, if you’re up to the challenge. The roads around Provence are relatively quiet and empty, making the region a fantastic destination for casual countryside rides. The abundance of dining and wine also makes for a noteworthy touch.',
        img:
          'https://mk0theadventuregfnyq.kinstacdn.com/wp-content/uploads/Provence-Photo-Credit-Christopher-Michel-via-Flickr-750px.jpg',
      },
    ],
    top_experiences: [
      {
        id: 1,
        name: 'Golden Gate park tour',
        location: 'San Francisco, US',
        img: 'https://docs.svalbard.dev/mobiledb/bike1.jpg',
        rate_per_person: 25,
        duration: '1 hour',
        group_size: 16,
        include: 'One bike, english guide',
        raiting: 4.51,
        raiting_count: 14,
        lat: '37.8073486',
        lon: '-122.4731274',
        categories: ['City', 'Family', 'Bike'],
        description:
          'How Long Will it Take to Bike the Golden Gate Bridge? Biking across the Golden Gate Bridge is a 2.1 mile ride from side to side, which usually takes about 10-25 minutes, depending on how strong of a cyclist you are, and how often you pull over to take photos.',
        meeting: 'We pick you up downtown San Francisco.',
        images: [
          'https://docs.svalbard.dev/mobiledb/golden1.jpg',
          'https://docs.svalbard.dev/mobiledb/goldenGate.jpg',
          'https://docs.svalbard.dev/mobiledb/golden2.jpg',
          'https://docs.svalbard.dev/mobiledb/golden3.jpg',
          'https://docs.svalbard.dev/mobiledb/golden4.jpg',
        ],
      },
    ],
  },
];

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'SET_CATEGORIES': {
      return payload;
    }
    case 'CLEAR_CATEGORIES': {
      return defaultState;
    }
    default:
      return state;
  }
}

export default reducer;
