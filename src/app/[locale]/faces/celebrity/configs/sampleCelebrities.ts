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
    imageUrl: "https://upstash.com/images/blog/v-bts.jpg",
    tags: ["bts", "k-pop", "korean", "kim taehyung"],
  },
  {
    id: "zendaya",
    name: "Zendaya",
    imageUrl: "https://upstash.com/images/blog/zendaya-actress.jpg",
    tags: ["hollywood", "american", "actress"],
  },
  {
    id: "scarlett-johansson",
    name: "Scarlett Johansson",
    imageUrl: "https://upstash.com/images/blog/scarlett-johansson.jpg",
    tags: ["hollywood", "american", "actress"],
  },
  {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    imageUrl: "https://upstash.com/images/blog/timothee-chalamet.jpg",
    tags: ["hollywood", "american", "actor"],
  },
  {
    id: "tom-holland",
    name: "Tom Holland",
    imageUrl: "https://upstash.com/images/blog/tom-holland.jpg",
    tags: ["hollywood", "british", "actor", "marvel"],
  },
];
