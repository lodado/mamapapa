export interface CelebrityProfile {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
}

export const CELEBRITY_PROFILES: CelebrityProfile[] = [
  {
    id: "iu",
    name: "IU",
    imageUrl: "https://qmwtuvttspuxwuwrsuci.supabase.co/storage/v1/object/public/pokitokiStorage//iu.jpg",
    tags: ["k-pop", "korean", "singer", "lee ji-eun"],
  },

  {
    id: "kim-taehyung",
    name: "V (BTS)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/V_in_the_Oval_Office_of_the_White_House%2C_May_31%2C_2022_%28cropped%29.jpg",
    tags: ["bts", "k-pop", "korean", "kim taehyung"],
  },

  {
    id: "jang-wonyoung",
    name: "Jang Won-young",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jang_Won-young_of_Ive%2C_April_16%2C_2025.png/960px-Jang_Won-young_of_Ive%2C_April_16%2C_2025.png",
    tags: ["k-pop", "korean", "singer", "ive"],
  },
  {
    id: "karina",
    name: "Karina",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Karina_performing_at_TikTok_Awards_%28cropped%29.jpg/500px-Karina_performing_at_TikTok_Awards_%28cropped%29.jpg",
    tags: ["k-pop", "korean", "singer", "aespa"],
  },
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/800px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
    tags: ["pop", "american", "singer", "songwriter"],
  },
  {
    id: "scarlett-johansson",
    name: "Scarlett Johansson",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Conf%C3%A9rence_de_Presse_Captain_America_2_%2813221950095%29_%28cropped%29.jpg/960px-Conf%C3%A9rence_de_Presse_Captain_America_2_%2813221950095%29_%28cropped%29.jpg",
    tags: ["hollywood", "american", "actress"],
  },
  {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Timoth%C3%A9e_Chalamet_Call_Me_By_Your_Name_Press_Conference_Berlinale_2017_%28cropped%29.jpg/800px-Timoth%C3%A9e_Chalamet_Call_Me_By_Your_Name_Press_Conference_Berlinale_2017_%28cropped%29.jpg",
    tags: ["hollywood", "american", "actor"],
  },
  {
    id: "tom-holland",
    name: "Tom Holland",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/800px-Tom_Holland_by_Gage_Skidmore.jpg",
    tags: ["hollywood", "british", "actor", "marvel"],
  },
];
