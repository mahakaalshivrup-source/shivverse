export interface JyotirlingaLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  desc: string;
  embedUrl: string;
}

const jyotirlingaData: JyotirlingaLocation[] = [
  { id: 1, name: "Somnath", lat: 20.888, lng: 70.4012, desc: "Considered the first among the twelve Jyotirlingas.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315354250!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREIydHpaUGc.!2m2!1d20.88801693129391!2d70.40100223500552!3f316.58690379803187!4f-12.218521337835867!5f0.7820865974627469" },
  { id: 2, name: "Mallikarjuna", lat: 16.0733, lng: 78.8686, desc: "Situated on the Shri Shaila mountain.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315055097!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0U5WV90TEE.!2m2!1d16.07512244453164!2d78.8681211987751!3f280!4f0!5f0.7820865974627469" },
  { id: 3, name: "Mahakaleshwar", lat: 23.1827, lng: 75.7682, desc: "The only Jyotirlinga facing south (Dakshinamukhi).", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315177912!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREMzNW12N2dF!2m2!1d23.18265749990239!2d75.76718028776023!3f0.6278212893846522!4f-4.935146500137975!5f0.7820865974627469" },
  { id: 4, name: "Omkareshwar", lat: 22.2448, lng: 76.1499, desc: "Situated on an island shaped like 'Om'.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315263614!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzV3X0xuaVFF!2m2!1d22.24079988820228!2d76.15097551708891!3f2.3126278677331555!4f-8.126932045050197!5f0.7820865974627469" },
  { id: 5, name: "Kedarnath", lat: 30.7352, lng: 79.0669, desc: "Located high in the snow-capped Himalayas.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315485791!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ016TFBjQ3c.!2m2!1d30.6125637250255!2d79.01325377221302!3f220.15535782717143!4f-6.206206990268839!5f0.7820865974627469" },
  { id: 6, name: "Bhimashankar", lat: 19.0728, lng: 73.5359, desc: "Nestled in the Sahyadri mountains.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315665176!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQy1vclNCQmc.!2m2!1d19.07195284017081!2d73.53596497803018!3f261.0965914797207!4f-18.449775297097716!5f0.4000000000000002" },
  { id: 7, name: "Kashi Vishwanath", lat: 25.3109, lng: 83.0107, desc: "Representing the supreme light in Varanasi.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315563072!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzFvZm5vR2c.!2m2!1d25.31085317731857!2d83.01067831133341!3f273.88745!4f0.11253999999999564!5f0.7820865974627469" },
  { id: 8, name: "Trimbakeshwar", lat: 19.9325, lng: 73.531, desc: "Features three faces embodying Brahma, Vishnu, and Mahesh.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315720574!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRGhxNGJtcVFF!2m2!1d19.93201031441094!2d73.5306731090837!3f100.91636554110724!4f8.965297154359035!5f0.7820865974627469" },
  { id: 9, name: "Vaidyanath", lat: 24.4947, lng: 86.6998, desc: "Where Ravana sacrificed his heads to Lord Shiva.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315765364!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDZ5SWpuc2dF!2m2!1d24.49252710913806!2d86.70021446718167!3f50.982018164909256!4f21.045010000000005!5f0.7820865974627469" },
  { id: 10, name: "Nageshwar", lat: 22.334, lng: 69.0131, desc: "Believed to protect devotees from all poisons.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786315815021!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDJydnZuOGdF!2m2!1d22.33596364061393!2d69.08700883114611!3f88.09913316939038!4f29.880248722994324!5f0.4000000000000002" },
  { id: 11, name: "Ramanathaswamy", lat: 9.2881, lng: 79.3174, desc: "Associated with Lord Rama's worship of Shiva.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786316077013!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2N2dERIaVFF!2m2!1d9.287957610035951!2d79.31594983128984!3f100!4f0!5f0.7820865974627469" },
  { id: 12, name: "Grishneshwar", lat: 20.0249, lng: 75.1709, desc: "Located near the famous Ellora Caves.", embedUrl: "https://www.google.com/maps/embed?pb=!4v1786316038493!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDl1YTI4cXdF!2m2!1d20.02491153034443!2d75.16986849871792!3f105.7596344750195!4f0.872390605450903!5f0.7820865974627469" },
];

export default jyotirlingaData;
