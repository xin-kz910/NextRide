export const fakePlans = {
  plans: [

    {
      plan_id: "P1",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_001",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:00",
          arrive_time: "11:00",
        },
      ],
    },


    {
      plan_id: "P2",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_001",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:00",
          arrive_time: "11:00",
        },
        {
          mode: "HSR",
          trip_id: "HSR_TC_KS_627",
          from_stop_id: "HSR_TAICHUNG_HSR",
          to_stop_id: "HSR_KAOHSIUNG_HSR",
          depart_time: "11:48",
          arrive_time: "12:45",
        },
      ],
    },


    {
      plan_id: "P3",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_002",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:20",
          arrive_time: "11:20",
        },
        {
          mode: "HSR",
          trip_id: "HSR_TC_KS_627",
          from_stop_id: "HSR_TAICHUNG_HSR",
          to_stop_id: "HSR_KAOHSIUNG_HSR",
          depart_time: "11:48",
          arrive_time: "12:45",
        },
        {
          mode: "TRA",
          trip_id: "TRA_KS_PT_109",
          from_stop_id: "TRA_KAOHSIUNG_TRA",
          to_stop_id: "TRA_PINGTUNG_TRA",
          depart_time: "13:06",
          arrive_time: "13:29",
        },
      ],
    },

    {
      plan_id: "P4",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_001",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:00",
          arrive_time: "11:00",
        },
        {
          mode: "HSR",
          trip_id: "HSR_TC_KS_621_fake",
          from_stop_id: "HSR_TAICHUNG_HSR",
          to_stop_id: "HSR_KAOHSIUNG_HSR",
          depart_time: "11:08",
          arrive_time: "12:05",
        },
      ],
    },

    {
      plan_id: "P5",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_001",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:00",
          arrive_time: "11:00",
        },
        {
          mode: "HSR",
          trip_id: "HSR_TC_KS_615_fake",
          from_stop_id: "HSR_TAICHUNG_HSR",
          to_stop_id: "HSR_KAOHSIUNG_HSR",
          depart_time: "11:02",
          arrive_time: "11:59",
        },
      ],
    },


    {
      plan_id: "P6",
      segments: [
        {
          mode: "BUS",
          trip_id: "BUS_HSR_001",
          from_stop_id: "BUS_NCNU",
          to_stop_id: "BUS_TAICHUNG_HSR",
          depart_time: "10:00",
          arrive_time: "11:00",
        },
        {
          mode: "HSR",
          trip_id: "HSR_TC_KS_NEG_fake",
          from_stop_id: "HSR_TAICHUNG_HSR",
          to_stop_id: "HSR_KAOHSIUNG_HSR",
          depart_time: "10:55",
          arrive_time: "11:52",
        },
      ],
    },
    
  ],
};
