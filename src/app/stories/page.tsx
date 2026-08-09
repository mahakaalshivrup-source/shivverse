"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// ═══════════════════════════════════════════════════
// Gradient palettes for fallback banners (per card)
// ═══════════════════════════════════════════════════
const gradients = [
  "from-slate-900 via-gray-900 to-black",
  "from-indigo-950 via-slate-900 to-black",
  "from-blue-950 via-gray-900 to-black",
  "from-cyan-950 via-slate-900 to-black",
  "from-violet-950 via-gray-900 to-black",
  "from-slate-900 via-zinc-900 to-black",
  "from-stone-900 via-gray-900 to-black",
  "from-neutral-900 via-slate-900 to-black",
  "from-blue-950 via-indigo-950 to-black",
  "from-emerald-950 via-gray-900 to-black",
  "from-purple-950 via-slate-900 to-black",
  "from-sky-950 via-gray-900 to-black",
  "from-rose-950 via-gray-900 to-black",
  "from-amber-950 via-slate-900 to-black",
  "from-teal-950 via-gray-900 to-black",
  "from-fuchsia-950 via-gray-900 to-black",
  "from-lime-950 via-slate-900 to-black",
  "from-orange-950 via-gray-900 to-black",
  "from-pink-950 via-slate-900 to-black",
  "from-cyan-950 via-indigo-950 to-black",
];

// ═══════════════════════════════════════════════════
// Complete 20 Stories Data
// ═══════════════════════════════════════════════════
const storiesData = [
  {
    id: 1,
    title: "The Churning of the Ocean (Samudra Manthan)",
    source: "Source: Shiva Purana, Bhagavata Purana (Canto 8)",
    sloka: "ॐ वन्दे देवमुमापतिं सुरगुरुं वन्दे जगत्कारणम् । वन्दे पन्नगभूषणं मृगधरं वन्दे पशूनां पतिम् ॥\n(Om Vande Deva Umapatim Suragurum Vande Jagatkaranam | Vande Pannagabhushanam Mrigadharam Vande Pashunam Patim ||)",
    english: "During the primordial times, the Devas (celestial demigods) and Asuras (demons) were constantly engaged in cosmic warfare. The Devas, having lost their divine strength and luster due to a severe curse by the short-tempered Sage Durvasa, sought refuge in Lord Vishnu. Vishnu advised them to churn the cosmic ocean (Kshira Sagara) to obtain 'Amrita', the sacred nectar of immortality. Left with no other choice, the Devas formed a temporary, uneasy alliance with the Asuras. They utilized Mount Mandara as the colossal churning rod and Vasuki, the mighty king of serpents who adorns Lord Shiva's neck, as the churning rope. As the magnificent churning began, numerous divine entities, breathtaking treasures, and celestial beings emerged from the infinite depths of the ocean. However, before the divine nectar could appear, the relentless churning produced a terrifying, world-destroying poison known as 'Halahala' (or Kalakuta). The poison was so lethal that its very fumes began to suffocate the entire creation, threatening to dissolve the universe into absolute nothingness. Panic-stricken and helpless, the Devas and Asuras fled to Mount Kailash, falling at the feet of Lord Shiva, the ultimate destroyer and protector, begging for his divine intervention. Lord Shiva, embodying supreme compassion and cosmic detachment, agreed to consume the deadly poison to save the universe. As he drank the Halahala, his divine consort, Goddess Parvati, realizing the immense potency of the toxin, immediately placed her hands on his throat to prevent the poison from descending into his stomach. The concentrated poison remained localized in his throat, turning it a deep, radiant blue. From that momentous day forth, Lord Shiva came to be universally revered as 'Neelkanth'—the one with the blue throat. This profound act of sacrifice symbolizes that a true yogi does not suppress the negativity of the world, nor do they let it corrupt their core; instead, they hold it in their throat, neutralizing its harm through supreme awareness and compassion. The entire cosmos rejoiced, singing hymns of his glory, forever indebted to the supreme ascetic who willingly swallowed death to grant life to the universe.",
    hindi: "प्राचीन काल में, देवों और असुरों के बीच निरंतर लौकिक युद्ध चल रहा था। क्रोधी ऋषि दुर्वासा के श्राप के कारण अपना दिव्य बल और तेज खो चुके देवताओं ने भगवान विष्णु की शरण ली। विष्णु जी ने उन्हें 'अमृत' प्राप्त करने के लिए क्षीर सागर का मंथन करने की सलाह दी। उन्होंने मंदराचल पर्वत को मथानी और वासुकी को रस्सी के रूप में उपयोग किया। मंथन से 'हलाहल' नामक भयानक विष उत्पन्न हुआ। भगवान शिव ने ब्रह्मांड को बचाने के लिए उस विष का सेवन किया। देवी पार्वती ने उनके गले पर हाथ रख दिए, जिससे विष गले में ही रुक गया और उनका गला नीला हो गया। तभी से भगवान शिव को 'नीलकंठ' कहा जाने लगा।",
    image: "/images/ai-generated-8019918_1280.jpg"
  },
  {
    id: 2,
    title: "The Descent of Ganga",
    source: "Source: Ramayana (Bala Kanda), Shiva Purana",
    sloka: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\n(Jatatavigalajjala pravahapavitasthale Galevalambya lambitam bhujangatungamalikam |)",
    english: "The epic saga begins with King Sagara, a prominent ancestor of Lord Rama, who performed the grand Ashvamedha Yagna to expand his empire. Fearing Sagara's growing power, Lord Indra stole the sacrificial horse and secretly tied it in the subterranean ashram of the meditating Sage Kapila. King Sagara's 60,000 sons aggressively searched the earth and eventually found the horse in the netherworld. In their arrogance, they falsely accused the sage of theft and disturbed his profound meditation. Opening his eyes in fiery wrath, Sage Kapila reduced all 60,000 princes to ashes with a mere glance, denying them the proper rites for salvation. Generations later, King Bhagiratha undertook excruciatingly severe penance to bring the sacred celestial river, Goddess Ganga, down from the heavens to Earth. Pleased by his absolute devotion, Lord Brahma granted the wish but warned that the Earth was too fragile to withstand Ganga's descent. Bhagiratha meditated deeply upon Shiva, who calmly agreed to break Ganga's violent fall. Lord Shiva caught the fierce goddess entirely within his infinitely matted hair (Jata). Ganga wandered lost, trapped in the infinite labyrinth of Shiva's divine locks for years, her arrogance completely shattered. Finally, Shiva released her in gentle, life-giving streams. This magnificent cosmic event earned Lord Shiva the revered name 'Gangadhara', the bearer of the river Ganga.",
    hindi: "यह महाकाव्य गाथा राजा सगर से शुरू होती है। राजा भगीरथ ने गंगा को स्वर्ग से पृथ्वी पर लाने के लिए घोर तपस्या की। भगवान शिव ने गंगा के वेग को अपनी जटाओं में धारण किया और फिर कोमल धाराओं में छोड़ दिया। इस घटना ने भगवान शिव को 'गंगाधर' नाम दिया।",
    image: "/images/ai-generated-8161581_1280.jpg"
  },
  {
    id: 3,
    title: "The Infinite Pillar of Light (Lingodbhava)",
    source: "Source: Shiva Purana (Vidyeshvara Samhita), Linga Purana",
    sloka: "निधनापतये नमः । निधनापतान्तिकाय नमः । ऊर्ध्वाय नमः । ऊर्ध्वलिङ्गाय नमः ।\n(Nidhanapataye Namah | Nidhanapatantikaya Namah | Urdhvaya Namah | Urdhvalingaya Namah |)",
    english: "In the beginning of time, a profound dispute arose between Lord Brahma and Lord Vishnu over who was the supreme power of the universe. Suddenly, a blazing, infinite pillar of fire—the Jyotirlinga—manifested between them. Brahma flew upward as a swan and Vishnu dug downward as a boar, but neither could find its end. Vishnu admitted defeat humbly. Brahma lied that he found the top. Shiva revealed himself and cursed Brahma to never be worshipped in temples. The Lingodbhava story illustrates that the Supreme Consciousness is absolutely boundless and can only be realized through humility and devotion.",
    hindi: "सृष्टि के आरंभ में ब्रह्मा और विष्णु के बीच विवाद हुआ। एक अनंत ज्योतिर्लिंग प्रकट हुआ। दोनों इसका अंत नहीं खोज पाए। विष्णु ने विनम्रतापूर्वक हार मानी, लेकिन ब्रह्मा ने झूठ बोला। शिव ने ब्रह्मा को श्राप दिया कि उनकी पूजा नहीं होगी।",
    image: "/images/ai-generated-8888593_1280.jpg"
  },
  {
    id: 4,
    title: "The Opening of the Third Eye",
    source: "Source: Shiva Purana (Rudra Samhita), Kumarasambhava by Kalidasa",
    sloka: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥\n(Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukamiva Bandhanan Mrityormukshiya Mamritat ||)",
    english: "Following the tragic death of Goddess Sati, Lord Shiva entered deep meditation. The Devas sent Kamadeva to awaken Shiva with arrows of desire. Shiva opened his Third Eye—the devastating eye of pure cosmic fire—and reduced Kamadeva to ashes instantly. This narrative signifies the burning of 'Kama' (desire) by 'Jnana' (wisdom). True divine love transcends physical attraction.",
    hindi: "देवी सती की मृत्यु के बाद शिव गहरे ध्यान में चले गए। कामदेव ने शिव पर इच्छा के तीर चलाए। शिव ने अपना तीसरा नेत्र खोला और कामदेव को भस्म कर दिया। यह कथा काम पर ज्ञान की विजय दर्शाती है।",
    image: "/images/lord-4045702_1280.jpg"
  },
  {
    id: 5,
    title: "Ravana and Mount Kailash",
    source: "Source: Uttara Kanda of Ramayana, Shiva Purana",
    sloka: "जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।\n(Jatakatahasambhramabhramannilimpanirjhari Vilolavicivallarivirajamanamurdhani |)",
    english: "Ravana, the mighty demon king of Lanka, tried to uproot Mount Kailash. Shiva simply pressed down with his toe, trapping Ravana for a thousand years. In agony, Ravana composed the magnificent Shiva Tandava Stotram. Moved by his devotion, Shiva freed him and granted him a divine sword. This story shows that Shiva crushes arrogance but melts with true devotion.",
    hindi: "रावण ने कैलाश पर्वत उठाने का प्रयास किया। शिव ने अपने अंगूठे से पर्वत दबा दिया। हजार वर्ष तक फंसे रावण ने शिव तांडव स्तोत्र की रचना की। भक्ति से प्रसन्न शिव ने उसे मुक्त किया।",
    image: "/images/lord-shiva-7155120_1280.jpg"
  },
  {
    id: 6,
    title: "The Dance of Destruction (Nataraja)",
    source: "Source: Kurma Purana, Chidambaram Mahatmyam",
    sloka: "नृत्तावसाने नटराजराजो ननाद ढक्कां नवपञ्चवारम् ।\n(Nrittavasane Nataraja Rajo Nanada Dhakkam Navapanchavaram |)",
    english: "In the forest of Thillai, arrogant sages tried to destroy Shiva with dark magic. They sent a tiger, a serpent, and the demon Apasmara. Shiva defeated them all and performed the Ananda Tandava—the cosmic Dance of Bliss—upon the vanquished demon, representing the eternal cycle of creation, preservation, and dissolution.",
    hindi: "तिल्लई के जंगल में अहंकारी ऋषियों ने शिव को नष्ट करने का प्रयास किया। शिव ने सबको पराजित किया और आनंद तांडव किया—सृष्टि, पालन और संहार के शाश्वत चक्र का प्रतीक।",
    image: "/images/lord-shiva-8918728_1280.png"
  },
  {
    id: 7,
    title: "Marriage of Shiva and Parvati",
    source: "Source: Shiva Purana, Skanda Purana",
    sloka: "ॐ उमामहेश्वराभ्यां नमः ।\n(Om Umamaheswvarabhyam Namah |)",
    english: "After the self-immolation of Sati, her soul was reborn as Parvati, daughter of the mountain king Himavan. Parvati performed intense tapasya for thousands of years to win Shiva's heart. Shiva tested her resolve by appearing as a Brahmin and criticizing himself, but Parvati's devotion never wavered. Moved by her unwavering love, Shiva accepted her as his eternal consort. Their divine marriage at Mount Kailash was attended by all the gods, sages, and celestial beings. Their union symbolizes the perfect balance between consciousness (Shiva) and energy (Shakti), proving that supreme love is born not from desire, but from the deepest devotion.",
    hindi: "सती के आत्मदाह के बाद उनकी आत्मा ने पार्वती के रूप में जन्म लिया। पार्वती ने हजारों वर्षों तक कठोर तपस्या की। शिव ने ब्राह्मण बनकर उनकी परीक्षा ली, लेकिन पार्वती की भक्ति अटल रही। उनका दिव्य विवाह शाश्वत प्रेम का प्रतीक है।",
    image: "/images/pexels-photo-18608505.avif"
  },
  {
    id: 8,
    title: "The Birth of Ganesha",
    source: "Source: Shiva Purana (Rudra Samhita)",
    sloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥\n(Vakratunda Mahakaya Suryakoti Samaprabha | Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada ||)",
    english: "Goddess Parvati created Ganesha from turmeric paste and breathed life into him to guard her privacy while she bathed. When Shiva returned, Ganesha blocked his entry. Not recognizing the boy, Shiva became furious and, in the ensuing battle, severed Ganesha's head. Upon learning the truth from Parvati's grief-stricken wails, Shiva replaced the head with that of a celestial elephant and declared Ganesha the leader of his ganas (celestial attendants) and the remover of all obstacles. This story teaches that even divine families face conflict, but love, wisdom, and redemption always prevail.",
    hindi: "देवी पार्वती ने हल्दी से गणेश को बनाया। शिव ने उन्हें न पहचानते हुए उनका सिर काट दिया। बाद में एक हाथी का सिर लगाकर उन्हें गणों का अधिपति और विघ्नहर्ता बनाया। यह कथा प्रेम और ज्ञान की विजय दर्शाती है।",
    image: "/images/pexels-photo-26099902.avif"
  },
  {
    id: 9,
    title: "The Birth of Kartikeya (Murugan)",
    source: "Source: Skanda Purana, Kumarasambhava",
    sloka: "षण्मुखाय नमः । कार्तिकेयाय नमः ।\n(Shanmukhaya Namah | Kartikeyaya Namah |)",
    english: "After Shiva's union with Parvati, a divine son was needed to defeat the invincible demon Tarakasura. Shiva's cosmic energy was so powerful that it had to be carried by Agni (fire) and cooled by Ganga before being nurtured by the six Krittikas (Pleiades star cluster). The child, Kartikeya, was born with six faces and grew into the supreme commander of the divine army. He slew Tarakasura in a fierce battle, liberating the three worlds. Kartikeya represents the focused, disciplined warrior energy that arises when consciousness and power unite.",
    hindi: "शिव और पार्वती के मिलन से एक दिव्य पुत्र की आवश्यकता थी। शिव की ऊर्जा को अग्नि और गंगा ने धारण किया। छह कृत्तिकाओं ने कार्तिकेय का पालन-पोषण किया। कार्तिकेय ने तारकासुर का वध किया और तीनों लोकों को मुक्त किया।",
    image: "/images/photo-1631879742203-3e670744cf2c.avif"
  },
  {
    id: 10,
    title: "Shiva as Ardhanarishvara",
    source: "Source: Linga Purana, Skanda Purana",
    sloka: "अर्धनारीश्वराय नमः ।\n(Ardhanarishwaraya Namah |)",
    english: "When the sage Bhringi refused to worship Parvati and only circumambulated Shiva, the divine couple merged into a single form—Ardhanarishvara—half male, half female. This form reveals that creation requires both masculine and feminine energy. Shiva (consciousness) and Shakti (energy) are not separate; they are one inseparable reality. Without Shakti, Shiva is inert; without Shiva, Shakti has no direction. This is perhaps the most profound statement on gender equality in ancient spiritual literature.",
    hindi: "जब ऋषि भृंगी ने केवल शिव की परिक्रमा की, तो शिव और पार्वती ने अर्धनारीश्वर रूप धारण किया—आधा पुरुष, आधा स्त्री। यह रूप दर्शाता है कि सृष्टि के लिए दोनों ऊर्जाओं की आवश्यकता है। शिव और शक्ति अभिन्न हैं।",
    image: "/images/photo-1693139441439-95ddfb2ecdba.avif"
  },
  {
    id: 11,
    title: "The Destruction of Tripura (Tripurantaka)",
    source: "Source: Matsya Purana, Shiva Purana",
    sloka: "त्रिपुरान्तकाय नमः ।\n(Tripurantakaya Namah |)",
    english: "Three powerful Asura brothers—Tarakaksha, Vidyunmali, and Kamalaksha—built three invincible flying cities (Tripura) of gold, silver, and iron. Granted a boon that they could only be destroyed by a single arrow when the three cities aligned, they terrorized the universe. When the celestial alignment occurred, Shiva mounted a chariot made of the Earth itself, used Mount Meru as the bow, Vasuki as the bowstring, and Vishnu as the arrow. With a single devastating shot, he destroyed all three cities simultaneously, earning the title Tripurantaka.",
    hindi: "तीन शक्तिशाली असुर भाइयों ने सोने, चांदी और लोहे के तीन अजेय उड़ते नगर बनाए। शिव ने पृथ्वी को रथ, मेरु पर्वत को धनुष और विष्णु को बाण बनाकर एक ही तीर से तीनों नगरों को नष्ट कर दिया।",
    image: "/images/photo-1759998756869-c8eeb78f49e8.avif"
  },
  {
    id: 12,
    title: "Shiva and the Hunter (Kannappa Nayanar)",
    source: "Source: Periya Puranam, Tamil Shaivite Literature",
    sloka: "भक्तवत्सलाय नमः ।\n(Bhaktavatsalaya Namah |)",
    english: "Kannappa was a wild tribal hunter who stumbled upon a Shiva linga in the forest. Not knowing proper worship rituals, he offered the deity water from his mouth, meat from his hunt, and flowers from his hair. When the linga's eye began to bleed, Kannappa gouged out his own eye to replace it. When the second eye bled, he placed his foot on the linga to mark its position before gouging out his remaining eye. Shiva, overwhelmed by this raw, selfless devotion, appeared and restored both his eyes. This story powerfully demonstrates that Shiva values the sincerity of devotion over ritual perfection.",
    hindi: "कण्णप्प एक जंगली शिकारी था जो जंगल में शिवलिंग के पास पहुंचा। उसने अपने मुंह से जल, शिकार का मांस और बालों से फूल चढ़ाए। जब लिंग की आंख से खून बहा, उसने अपनी आंख निकालकर रख दी। शिव ने उसकी निष्कपट भक्ति से प्रसन्न होकर उसकी आंखें वापस कर दीं।",
    image: "/images/shiva-4029469_1280.jpg"
  },
  {
    id: 13,
    title: "The Slaying of Andhaka",
    source: "Source: Matsya Purana, Kurma Purana",
    sloka: "अन्धकासुरसंहारकाय नमः ।\n(Andhakasurasamharakaya Namah |)",
    english: "Andhaka, a blind demon born from Shiva and Parvati's sweat, was raised by the Asura king Hiranyaksha. Growing incredibly powerful, Andhaka lusted after Parvati, not knowing she was his mother. Enraged, Shiva impaled him on his trident. As Andhaka's blood touched the ground, thousands of duplicates arose. Shiva assumed the terrifying Bhairava form and instructed Goddess Chandika to drink the falling blood before it touched the earth. After an eons-long battle, Andhaka was purified by hanging on Shiva's trident, and his sins were burned away. Shiva forgave him, making him Bhringi, a devoted attendant.",
    hindi: "अन्धक, शिव और पार्वती के पसीने से जन्मा अंधा राक्षस, अपनी माता पार्वती पर मोहित हो गया। क्रोधित शिव ने उसे त्रिशूल पर चढ़ाया। लंबी लड़ाई के बाद अन्धक शुद्ध हुआ और शिव का भक्त बन गया।",
    image: "/images/shiva-8623105_1280.jpg"
  },
  {
    id: 14,
    title: "Shiva as Dakshinamurthy (The Supreme Guru)",
    source: "Source: Shiva Purana, Dakshinamurthy Stotram by Adi Shankaracharya",
    sloka: "ॐ नमः प्रणवार्थाय शुद्धज्ञानैकमूर्तये । निर्मलाय प्रशान्ताय दक्षिणामूर्तये नमः ॥\n(Om Namah Pranavarthaya Shuddha Jnanaikamurtaye | Nirmalaya Prashantaya Dakshinamurtaye Namah ||)",
    english: "At the beginning of creation, the four Kumaras—Sanaka, Sanandana, Sanatana, and Sanatkumara—approached the young-looking Shiva seated under a banyan tree. Without uttering a single word, Shiva transmitted the deepest spiritual wisdom through pure silence and the Chin Mudra (gesture of consciousness). The sages' doubts dissolved instantly. This form of Shiva as Dakshinamurthy represents the ultimate teacher who conveys truth beyond words. It demonstrates that the highest knowledge is transmitted not through lecture, but through the silent presence of an awakened master.",
    hindi: "सृष्टि के आरंभ में चार कुमार बरगद के पेड़ के नीचे बैठे युवा शिव के पास आए। बिना एक शब्द बोले, शिव ने मौन और चिन मुद्रा से गहनतम ज्ञान प्रसारित किया। दक्षिणामूर्ति शिव का वह रूप है जो मौन में सत्य का संचार करता है।",
    image: "/images/ai-generated-8019918_1280.jpg"
  },
  {
    id: 15,
    title: "Destruction of Daksha's Sacrifice",
    source: "Source: Vayu Purana, Shiva Purana",
    sloka: "रुद्राय नमः । भीमाय नमः । वीरभद्राय नमः ।\n(Rudraya Namah | Bhimaya Namah | Virabhadraya Namah |)",
    english: "Daksha, the father of Sati, organized a grand yajna but deliberately insulted Shiva by not inviting him. Despite Shiva's warnings, Sati attended and was publicly humiliated. Unable to bear the insult to her beloved husband, Sati immolated herself in the sacrificial fire. Upon hearing the devastating news, Shiva's grief transformed into unimaginable fury. He tore a matted lock from his hair and smashed it on the ground, creating the fearsome warrior Virabhadra. The terrifying deity stormed Daksha's assembly, destroying everything in his path. He beheaded Daksha himself. Later, Shiva, in his compassion, restored Daksha to life with a goat's head, teaching him humility.",
    hindi: "दक्ष ने शिव को अपमानित करने के लिए यज्ञ में नहीं बुलाया। सती ने अपमान सहन न कर पाकर आत्मदाह कर लिया। शिव ने अपने बाल से वीरभद्र को उत्पन्न किया जिसने दक्ष का सिर काट दिया। बाद में शिव ने करुणावश दक्ष को बकरे का सिर लगाकर जीवित किया।",
    image: "/images/ai-generated-8161581_1280.jpg"
  },
  {
    id: 16,
    title: "Shiva Drinks the Cosmic Poison (Neelkanth)",
    source: "Source: Bhagavata Purana, Vishnu Purana",
    sloka: "नीलकण्ठाय नमः । महादेवाय नमः ।\n(Neelkanthaya Namah | Mahadevaya Namah |)",
    english: "When the deadly Halahala poison emerged from the churning of the ocean, its toxic fumes began engulfing the universe. All beings fled in terror. Only Shiva stepped forward. With absolute serenity, he scooped up the poison and drank it. Parvati, acting swiftly, pressed his throat to prevent it from entering his stomach. The poison turned his throat a brilliant, luminous blue—forever marking him as Neelkanth. This act represents the ultimate sacrifice: the willingness to absorb the toxicity of the world so that others may live. It is the highest form of compassion, embodied by the supreme ascetic.",
    hindi: "समुद्र मंथन से निकले हलाहल विष से ब्रह्मांड में भय व्याप्त हो गया। केवल शिव ने आगे बढ़कर विष पी लिया। पार्वती ने उनका गला दबाया, जिससे विष गले में रुक गया और गला नीला हो गया। इसलिए शिव 'नीलकंठ' कहलाए।",
    image: "/images/ai-generated-8888593_1280.jpg"
  },
  {
    id: 17,
    title: "Shiva as Bhairava (The Terror of Time)",
    source: "Source: Shiva Purana, Skanda Purana",
    sloka: "कालभैरवाय नमः ।\n(Kalabhairavaya Namah |)",
    english: "When Lord Brahma's fifth head spoke arrogantly, claiming supremacy over all creation, Shiva manifested his most terrifying form—Bhairava, the embodiment of time and destruction. With a single nail of his left hand, Bhairava severed Brahma's fifth head. However, because killing a Brahmin (even Brahma) carries cosmic consequences, the skull fused to Bhairava's hand. He wandered the universe as a mendicant for twelve years, begging for alms to expiate the sin. The skull finally fell off at Varanasi (Kashi), making it the holiest city. Bhairava represents the fierce aspect of Shiva that annihilates ego and the illusion of time itself.",
    hindi: "जब ब्रह्मा का पांचवां सिर अहंकार से बोला, शिव ने भैरव रूप धारण करके उसे काट दिया। ब्रह्मा की हत्या का पाप उतारने के लिए भैरव ने बारह वर्ष भिक्षाटन किया। वाराणसी में वह कपाल गिरा, जिससे काशी सबसे पवित्र नगरी बनी।",
    image: "/images/lord-4045702_1280.jpg"
  },
  {
    id: 18,
    title: "The Story of Markandeya (Conqueror of Death)",
    source: "Source: Markandeya Purana, Shiva Purana",
    sloka: "मृत्युञ्जयाय नमः ।\n(Mrityunjayaya Namah |)",
    english: "Sage Mrikandu prayed for a son and was given a choice: a foolish son with a long life or a brilliant son who would die at sixteen. He chose brilliance. Markandeya, the prodigious child, was an ardent devotee of Shiva. On the fated day of his death, he clung to a Shiva linga, praying fervently. When Yama, the god of death, threw his noose around Markandeya, it accidentally encircled the Shiva linga as well. Shiva erupted from the linga in his furious Kala Bhairava form and kicked Yama in the chest, killing Death itself. Shiva then blessed Markandeya to remain forever sixteen years old. This is the origin of the Maha Mrityunjaya Mantra and demonstrates that true devotion to Shiva conquers even death.",
    hindi: "मार्कण्डेय सोलह वर्ष में मरने वाला प्रतिभाशाली बालक था। मृत्यु के दिन उसने शिवलिंग को पकड़ लिया। यमराज का फंदा शिवलिंग पर भी पड़ा। शिव ने यमराज को लात मारकर मृत्यु को ही मार दिया और मार्कण्डेय को चिरयुवा रहने का वरदान दिया।",
    image: "/images/lord-shiva-7155120_1280.jpg"
  },
  {
    id: 19,
    title: "Shiva's Cosmic Bow (Tripura Vijaya)",
    source: "Source: Shiva Dhanurveda, Ramayana",
    sloka: "पिनाकधृषे नमः ।\n(Pinakadhrishe Namah |)",
    english: "Shiva's bow Pinaka is one of the most powerful weapons in cosmic mythology. It was this bow that Shiva used to destroy the three flying cities of the demons. Later, a fragment of this divine bow was given to King Janaka's lineage. It was so impossibly heavy that no mortal or god could even lift it. When young Prince Rama effortlessly lifted and strung the bow during Sita's Swayamvara, the bow snapped with a thunderous sound that shook the universe. This act not only won Rama the hand of Sita but also signified that Rama was an avatar of Vishnu, worthy of wielding Shiva's divine power. The breaking of Pinaka symbolizes the merging of Vaishnavism and Shaivism.",
    hindi: "शिव का धनुष पिनाक ब्रह्मांड के सबसे शक्तिशाली अस्त्रों में से एक है। इसी धनुष से शिव ने तीन उड़ते नगरों को नष्ट किया। बाद में राजा जनक के वंश को यह धनुष मिला। जब युवा राम ने इसे सहज उठाकर तोड़ा, तो यह शिव और विष्णु की शक्ति के मिलन का प्रतीक बना।",
    image: "/images/lord-shiva-8918728_1280.png"
  },
  {
    id: 20,
    title: "Shiva and the Devotee Nandi",
    source: "Source: Shiva Purana, Nandi Upanishad",
    sloka: "नन्दिकेश्वराय नमः ।\n(Nandikeshvaraya Namah |)",
    english: "Nandi was born as the son of sage Shilada through divine blessings. From birth, he was destined to die young. But Nandi's devotion to Shiva was so intense and pure that he meditated without eating or sleeping for thousands of years. Moved beyond measure, Shiva appeared before Nandi and granted him immortality, making him the eternal bull—the guardian of Shiva's abode, the keeper of sacred knowledge, and the first disciple. Nandi sits eternally facing the Shiva linga in every temple, symbolizing the perfect devotee: patient, unwavering, and forever gazing at the divine. He represents the ideal student who receives wisdom through absolute stillness and focused attention.",
    hindi: "नंदी ऋषि शिलाद के पुत्र थे। अल्पायु होने के बावजूद उन्होंने हजारों वर्ष तक शिव की तपस्या की। शिव ने उन्हें अमरत्व प्रदान किया और अपना शाश्वत वाहन, कैलाश का द्वारपाल और प्रथम शिष्य बनाया। हर मंदिर में नंदी शिवलिंग की ओर मुख करके बैठे हैं—आदर्श भक्त का प्रतीक।",
    image: "/images/pexels-photo-18608505.avif"
  },
];

// ═══════════════════════════════════════════════════
// StoryCard sub-component with fallback banner
// ═══════════════════════════════════════════════════
function StoryCard({
  story,
  index,
  onClick,
}: {
  story: (typeof storiesData)[0];
  index: number;
  onClick: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const gradient = gradients[story.id % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.3 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/5] cursor-pointer shadow-lg hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(100,149,237,0.2)] transition-all duration-300"
    >
      {/* Background: Image or Fallback Banner */}
      <div className="absolute inset-0">
        {!imgFailed ? (
          <img
            src={story.image}
            alt={story.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover opacity-60 brightness-[1.8] group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-110"
          />
        ) : (
          /* ═══ Dynamic Fallback Banner ═══ */
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-8`}
          >
            <p className="text-white/30 text-2xl md:text-3xl font-serif font-bold text-center leading-snug select-none">
              {story.title}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent group-hover:from-black transition-colors duration-500" />
      </div>

      {/* Content Container (Bottom) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 transform transition-transform duration-500 group-hover:-translate-y-2">
          {story.title}
        </h2>
        <div className="w-10 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0" />
      </div>

      {/* Subtle glow border on hover */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-2xl transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════
export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<
    (typeof storiesData)[0] | null
  >(null);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleStories = storiesData.slice(0, visibleCount);
  const hasMore = visibleCount < storiesData.length;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          The Cosmic Tales
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Delve into the ancient myths and legends of Lord Shiva. Each story
          reveals a profound truth about existence, duty, and devotion.
        </p>
      </motion.div>

      {/* Grid Layout for Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleStories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            index={index}
            onClick={() => setSelectedStory(story)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + 6, storiesData.length)
              )
            }
            className="group px-8 py-3.5 rounded-full border border-white/20 text-white font-medium tracking-wide hover:bg-white/5 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300 flex items-center gap-2"
          >
            Load More Stories
            <ChevronDown
              size={18}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </motion.div>
      )}

      {/* Story count indicator */}
      <p className="text-center text-gray-600 text-sm mt-6">
        Showing {visibleStories.length} of {storiesData.length} stories
      </p>

      {/* ═══ Detailed Story Modal ═══ */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0f14]/95 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header section with sticky behavior */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-white/5 bg-[#0a0f14]/80 backdrop-blur-md">
                {/* Language Switch */}
                <div className="flex bg-black/50 p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setLanguage("english")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      language === "english"
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("hindi")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      language === "hindi"
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    हिंदी
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto p-6 md:p-10 hide-scrollbar">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
                  {selectedStory.title}
                </h2>

                <p className="text-blue-400/80 text-sm italic tracking-wide mb-8">
                  {selectedStory.source}
                </p>

                {/* Sloka Container */}
                <div className="relative mb-10 p-6 md:p-8 rounded-xl bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                  <p className="text-lg md:text-xl font-medium text-blue-100 leading-loose text-center md:text-left whitespace-pre-line">
                    {selectedStory.sloka}
                  </p>
                </div>

                {/* Main Story Text */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed md:leading-loose text-lg">
                    {selectedStory[language]}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
