export const mockDriverTrips = {
  upcoming: [
    {
      id: "du1",
      route: "Negombo → Colombo Fort",
      passengers: 3,
      distanceKm: 7.8,
      fare: 420,
      status: "Upcoming",
      time: "Tomorrow, 8:20 AM",
    },
  ],
  completed: [
    {
      id: "dc1",
      route: "Gampaha → Colombo",
      passengers: 2,
      distanceKm: 5.2,
      fare: 380,
      status: "Completed",
      time: "Today, 8:05 AM",
    },
    {
      id: "dc2",
      route: "Kandy → Peradeniya",
      passengers: 1,
      distanceKm: 6.7,
      fare: 360,
      status: "Completed",
      time: "Yesterday, 6:15 PM",
    },
  ],
  cancelled: [
    {
      id: "dx1",
      route: "Katunayake → Colombo",
      passengers: 2,
      distanceKm: 9.3,
      fare: 0,
      status: "Cancelled",
      time: "Mar 10, 5:40 PM",
    },
  ],
};

