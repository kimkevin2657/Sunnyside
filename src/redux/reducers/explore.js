const defaultState = {
  search: {
    places: '',
    selectedDate: null,
    adults: 0,
    children: 0,
  },
  experienceResults: {
    experiences: [
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
        id: 3,
        name: 'Private Wine Country Tour',
        location: 'Sonoma, US',
        img: 'https://docs.svalbard.dev/mobiledb/sonoma.jpg',
        rate_per_person: 35,
        duration: '1.5 hours',
        group_size: 5,
        include: 'Food, Drinks included',
        raiting: 4.98,
        raiting_count: 28,
        lat: '38.3033617',
        lon: '-122.4918773',
        categories: ['Forest', 'Family'],
        description:
          "Sonoma County, California, is famous for so many things that it's hard to keep them all straight. Of course, we're probably most famous for our vineyards and the amazing wines we produce — wines that win gold medals in competitions all around the world.",
        meeting: 'We pick you up downtown San Francisco.',
      },
      {
        id: 4,
        name: 'San Francisco Cable Car with your personal Guide',
        location: 'San Francisco, US',
        img: 'https://docs.svalbard.dev/mobiledb/cable6.jpg',
        rate_per_person: 18,
        duration: 'half an hour',
        group_size: 6,
        include: 'One turn on cable car, english guide',
        raiting: 4.21,
        raiting_count: 384,
        lat: '37.8066662',
        lon: '-122.4202423',
        categories: ['City', 'Family'],
        description:
          "The Powell-Hyde Line starts at the cable car turn-around at Powell Street and Market Street. On this route, you'll have views of Coit Tower, Alcatraz Island, and San Francisco Bay. As it rides north along Powell Street, you pass by Union Square and ride up to Nob Hill where the views can't be beaten.",
        meeting: 'We pick you up downtown San Francisco.',
        images: [
          'https://docs.svalbard.dev/mobiledb/cable3.jpg',
          'https://docs.svalbard.dev/mobiledb/cable1.jpg',
          'https://docs.svalbard.dev/mobiledb/cable4.jpg',
          'https://docs.svalbard.dev/mobiledb/cable7.jpg',
          'https://docs.svalbard.dev/mobiledb/cablecar.jpg',
          'https://docs.svalbard.dev/mobiledb/cable5.jpg',
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
    noResults: false,
    loading: false,
  },
};

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'SET_EXPLORE': {
      return payload;
    }
    case 'RESET_EXPLORE': {
      return defaultState;
    }
    case 'UPDATE_EXPLORE': {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
}

export default reducer;
