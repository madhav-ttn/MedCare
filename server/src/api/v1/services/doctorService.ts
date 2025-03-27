import { Doctor } from "../lib/types";
import doctorModel from "../models/doctorModel";

function debounceSearch() {
  let timer: NodeJS.Timeout;

  return function (doctorQuery: string): Promise<Doctor[] | undefined> {
    return new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        const doctors = await doctorModel.getDoctorsByUserQuery(doctorQuery);
        if (doctors.success) {
          resolve(doctors.data);
        }
        console.log("searching");
      }, 1000);
    });
  };
}

function getDoctorMap() {
  const map = new Map();
  for (let i = 1; i <= 5; i++) {
    map.set(`${i} star`, i);
  }
  map.set("0-1 years", [0, 1]);
  map.set("1-3 years", [1, 3]);
  map.set("3-5 years", [3, 5]);
  map.set("5-10 years", [5, 10]);
  map.set("10-15 years", [10, 15]);
  map.set("15+ years", [15]);

  map.set("male", "MALE");
  map.set("female", "FEMALE");
  return map;
}

const searchDoc = debounceSearch();

export const doctorService = {
  searchDoctors: async (doctorQuery: string) => {
    try {
      const doctors = await searchDoc(doctorQuery);
      return {
        success: true,
        data: doctors,
      };
    } catch (error) {
      console.log("Error in getting top doctors", error);
      return {
        success: false,
        message: "Error in getting top doctors",
      };
    }
  },
  // getTopDoctors: async () => {
  //   try {
  //     const doctors = await doctorModel.getTopDoctors();
  //     return {
  //       success: true,
  //       data: doctors.data,
  //     };
  //   } catch (error) {
  //     console.log("Error in getting top doctors", error);
  //     return {
  //       success: false,
  //       message: "Error in getting top doctors",
  //     };
  //   }
  // },
  getFilteredDoctors: async (
    rating: string,
    experience: string,
    gender: string,
    searchQuery: string,
    parsedCurrentPage: number
  ) => {
    try {
      const mp = getDoctorMap();
      const details = {
        rating: mp.get(rating),
        experience: mp.get(experience),
        gender: mp.get(gender),
        searchQuery: searchQuery,
        parsedCurrentPage: parsedCurrentPage,
      };
      const result = await doctorModel.getFilteredDoctors(details);
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.log("Error in getting filtered doctors", error);
      return {
        success: false,
        message: "Error in getting filtered doctors",
      };
    }
  },
};
