export const pakistanData: Record<string, string[]> = {
  Punjab: [
    "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot",
    "Bahawalpur", "Sargodha", "Sahiwal", "Sheikhupura", "Rahim Yar Khan",
    "Jhang", "Dera Ghazi Khan", "Gujrat", "Jhelum", "Kasur", "Okara",
    "Chiniot", "Kamoke", "Hafizabad", "Mandi Bahauddin", "Toba Tek Singh",
    "Khanewal", "Muzaffargarh", "Vehari", "Lodhran", "Pakpattan", "Mianwali",
    "Bhakkar", "Khushab", "Layyah", "Attock", "Chakwal", "Narowal",
    "Bahawalnagar", "Rajanpur", "Nankana Sahib", "Phalia", "Taxila",
    "Wah Cantonment", "Muridke", "Kot Addu", "Arifwala", "Burewala",
    "Jaranwala", "Daska", "Wazirabad", "Sambrial", "Haroonabad",
    "Chishtian", "Sadiqabad", "Liaqatpur", "Ahmadpur East", "Jatoi",
    "Kot Abdul Malik", "Ferozewala", "Pattoki", "Renala Khurd",
    "Depalpur", "Chichawatni", "Kabirwala", "Dunyapur", "Mailsi",
    "Hasilpur", "Taunsa", "Ali Pur", "Jampur", "Pir Mahal",
    "Kamalia", "Sangla Hill", "Sharaqpur", "Safdarabad"
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah",
    "Mirpur Khas", "Jacobabad", "Shikarpur", "Khairpur", "Dadu",
    "Thatta", "Badin", "Tando Allahyar", "Tando Adam", "Umerkot",
    "Ghotki", "Sanghar", "Kandhkot", "Matiari", "Tando Muhammad Khan",
    "Kashmore", "Naushahro Feroze", "Jamshoro", "Kambar", "Shahdadkot",
    "Ratodero", "Sehwan", "Hala", "Mithi", "Diplo",
    "Kotri", "Kunri", "Daharki", "Dokri", "Mehar",
    "Moro", "Sakrand", "Shahdadpur", "Pano Aqil", "Rohri",
    "Naudero", "Warah", "Johi", "Bhiria", "Sita Road"
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Swat", "Mingora",
    "Kohat", "Dera Ismail Khan", "Charsadda", "Nowshera", "Mansehra",
    "Swabi", "Bannu", "Haripur", "Lakki Marwat", "Tank",
    "Batkhela", "Karak", "Hangu", "Chitral", "Dir",
    "Buner", "Shangla", "Timergara", "Lower Dir", "Upper Dir",
    "Malakand", "Daggar", "Parachinar", "Landikotal", "Jamrud",
    "Takht Bhai", "Risalpur", "Tangi", "Thall", "Topi",
    "Shabqadar", "Havelian", "Balakot", "Battagram", "Kolai Pallas"
  ],
  Balochistan: [
    "Quetta", "Turbat", "Khuzdar", "Hub", "Chaman",
    "Gwadar", "Zhob", "Sibi", "Dera Murad Jamali", "Dera Allah Yar",
    "Loralai", "Pishin", "Mastung", "Kalat", "Nushki",
    "Panjgur", "Washuk", "Awaran", "Lasbela", "Bela",
    "Jaffarabad", "Nasirabad", "Bolan", "Kech", "Musakhel",
    "Sherani", "Ziarat", "Harnai", "Kohlu", "Dera Bugti",
    "Jhal Magsi", "Kharan", "Surab", "Dalbandin", "Pasni",
    "Ormara", "Gadani", "Uthal", "Wadh", "Sorab"
  ],
  "Islamabad Capital Territory": [
    "Islamabad"
  ],
  "Azad Jammu & Kashmir": [
    "Muzaffarabad", "Mirpur", "Bhimber", "Kotli", "Rawalakot",
    "Bagh", "Pallandri", "Haveli", "Neelum", "Hattian Bala",
    "Athmuqam", "Hajira", "Abbaspur", "Barnala", "Dadyal",
    "Chakswari", "Mangla", "New Mirpur", "Chinari", "Garhi Dupatta"
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Nagar", "Ghizer",
    "Astore", "Diamer", "Chilas", "Khaplu", "Shigar",
    "Danyore", "Aliabad", "Karimabad", "Gahkuch", "Juglot",
    "Ghanche", "Roundu", "Tangir", "Darel", "Oshikhandass"
  ]
};

export const provinces = Object.keys(pakistanData);

export function getCitiesByProvince(province: string): string[] {
  return pakistanData[province] || [];
}
