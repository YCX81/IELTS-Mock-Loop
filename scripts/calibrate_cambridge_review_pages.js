const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");
const TEXT_PAGES = path.join(GENERATED, "text-pages");
const PAGE_JSON = path.join(GENERATED, "page-json");
const REPORTS = path.join(GENERATED, "reports");

const calibrations = [
  {
    book: "04",
    page: 3,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `SECTION 2 Questions 11-20
Questions 11-13
Complete the sentence below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

RIVERSIDE INDUSTRIAL VILLAGE

11 Riverside Village was a good place to start an industry because it had water, raw
materials and fuels such as ______________ and ______________.
12 The metal industry was established at Riverside Village by ______________ who
lived in the area.
13 There were over ______________ water-powered mills in the area in the
eighteenth century.

Questions 14-20
Label the plan below.
Write NO MORE THAN THREE WORDS for each answer.`,
    notes: [
      "Question stem and completion blanks verified against the rendered page.",
      "The plan itself continues on page 4.",
    ],
  },
  {
    book: "04",
    page: 4,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-04/page-004-riverside-industrial-village-plan.png",
    text: `Riverside Industrial Village plan

Fixed labels:
- River
- The Engine Room
- The Grinding Shop
- Yard
- The Stables
- The Works Office
- Car Park
- Entrance
- Toilets

Question labels:
14 ______ Road
15 The ______
16 The ______
17 The ______
18 The ______
19 The ______
20 The ______ for the workers`,
    notes: [
      "Converted the OCR-only plan into a stable text representation of fixed labels and numbered blanks.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "04",
    page: 6,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `A must read
B useful
C limited value
D read first section
E read research methods
F read conclusion
G don't read

Example
Anderson and Hawker: A

Jackson: 23 ______
Roberts: 24 ______
Morris: 25 ______
Cooper: 26 ______
Forster: 27 ______

Questions 28-30
Label the chart below.
Choose your answer from the box below and write the letters A-H next to
questions 28-30.`,
    notes: [
      "List choices, example, and Questions 23-30 instructions verified against page image.",
      "The chart itself continues on page 7.",
    ],
  },
  {
    book: "04",
    page: 7,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-04/page-007-population-studies-bar-chart.png",
    text: `Population studies
Reasons for changing accommodation

Bar chart labels:
1 C
2 28 ______
3 E
4 29 ______
5 G
6 30 ______

Possible reasons
A uncooperative landlord
B environment
C space
D noisy neighbors
E near city
F work location
G transport
H rent`,
    notes: [
      "Chart title, numbered blanks, known bar labels, and option list verified against page image.",
      "Bar heights are visual context only; answer selection depends on labels A-H.",
    ],
  },
  {
    book: "04",
    page: 17,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `they vary in the range of sounds they produce, and many forage for food using echo-location. Large baleen whales primarily use the lower frequencies and are often limited in their repertoire. Notable exceptions are the nearly song-like choruses of bowhead whales in summer and the complex, haunting utterances of the humpback whales. Toothed species in general employ more of the frequency spectrum, and produce a wider variety of sounds, than baleen species (though the sperm whale apparently produces a monotonous series of high-energy clicks and little else). Some of the more complicated sounds are clearly communicative, although what role they may play in the social life and 'culture' of cetaceans has been more the subject of wild speculation than of solid science.

Echolocation: the perception of objects by means of sound wave echoes.

Questions 15-21

Complete the table below.
Choose NO MORE THAN THREE WORDS from Reading Passage 2 for each answer.
Write your answers in boxes 15-21 on your answer sheet.

| SENSE | SPECIES | ABILITY | COMMENTS |
| --- | --- | --- | --- |
| Smell | toothed | no | evidence from brain structure |
| Smell | baleen | not certain | related brain structures are present |`,
    notes: [
      "Question instructions and the first two table rows verified against the rendered page.",
      "This table continues on page 18 and is stored as Markdown table rows for the CBT view.",
    ],
  },
  {
    book: "04",
    page: 18,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `| Taste | some types | poor | nerves linked to their 15 __________ are underdeveloped |
| Touch | all | yes | region around the blowhole very sensitive |
| Vision | 16 __________ | yes | probably do not have stereoscopic vision |
| Vision | dolphins, porpoises | yes | probably have stereoscopic vision 17 __________ and __________ |
| Vision | 18 __________ | yes | probably have stereoscopic vision forward and upward |
| Vision | bottlenose dolphin | yes | exceptional in 19 __________ and good in air-water interface |
| Vision | boutu and beiji | poor | have limited vision |
| Vision | Indian susu | no | probably only sense direction and intensity of light |
| Hearing | most large baleen | yes | usually use 20 __________; repertoire limited |
| Hearing | 21 __________ whales and __________ whales | yes | song-like |
| Hearing | toothed | yes | use more of frequency spectrum; have wider repertoire |`,
    notes: [
      "Continuation rows for Questions 15-21 verified against the rendered page.",
      "Rows are designed to join the Markdown table header from page 17 in the structured CBT view.",
    ],
  },
  {
    book: "04",
    page: 28,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The table below shows the proportion of different categories of families
living in poverty in Australia in 1999.

Summarize the information by selecting and reporting the main features,
and make comparisons where relevant.

Write at least 150 words.

| Family type | Proportion of people from each household type living in poverty |
| --- | --- |
| single aged person | 6% (54,000) |
| aged couple | 4% (48,000) |
| single, no children | 19% (359,000) |
| couple, no children | 7% (211,000) |
| sole parent | 21% (232,000) |
| couple with children | 12% (933,000) |
| all households | 11% (1,837,000) |`,
    notes: [
      "Writing Task 1 wording and poverty table values verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 29,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `WRITING TASK 2
You should spend about 40 minutes on this task.

Write about the following topic:

Compare the advantages and disadvantages of three of the following as media
for communicating information. State which you consider to be the most effective.

- comics
- books
- radio
- television
- film
- theatre

Give reasons for your answer and include any relevant examples from your own
knowledge or experience.

Write at least 250 words.`,
    notes: [
      "Writing Task 2 prompt and media list verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 34,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `3 Who did Peter talk to at the bank?
A an old friend
B an American man
C a German man

4 Henry gave Peter a map of
A the city.
B the bus routes.
C the train system.

5 What do Peter and Sally decide to order?
A food and drinks
B just food
C just drinks

Questions 6-8
Complete the notes below using words from the box.

Art Gallery
Cathedral
Castle
Gardens
Markets`,
    notes: [
      "Questions 3-5 and the word box for Questions 6-8 verified against the rendered page.",
      "The completion statements for Questions 6-8 continue on page 35.",
    ],
  },
  {
    book: "04",
    page: 35,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `Tourist attractions open all day: 6 ______________________ and Gardens
Tourist attractions NOT open on Mondays: 7 ______________________ and Castle
Tourist attractions which have free entry: 8 ______________________ and Markets

Questions 9 and 10
Complete the sentences below.
Write NO MORE THAN THREE WORDS for each answer.

9 The first place Peter and Sally will visit is the ______________________.
10 At the Cathedral, Peter really wants to ______________________.`,
    notes: [
      "Question prompts, capitalization of NOT, and word limit verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 60,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-04/page-060-061-electricity-demand-and-use.png",
    text: `WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The graph below shows the demand for electricity in England during
typical days in winter and summer. The pie chart shows how electricity is used
in an average English home.

Summarize the information by selecting and reporting the main features,
and make comparisons where relevant.

Write at least 150 words.

Line graph: Typical daily demand for electricity
Y-axis: Units of electricity, from 0 to 40,000+.
X-axis: 0 hrs, 3, 6, 9, 12, 15, 18, 21, 24.
Series:
- Winter: about 35,000 units at 0 hrs; rises to nearly 40,000 around 3 hrs; falls to about 30,000 around 9 hrs; rises to around 40,000 from 15-18 hrs; peaks above 40,000 around 21 hrs; drops to about 35,000 by 24 hrs.
- Summer: about 18,000 units at 0 hrs; gradually falls to about 13,000 around 9 hrs; rises to about 20,000 around 14-15 hrs; falls to around 16,000; rises again to just under 20,000 by 24 hrs.

The pie chart continues on page 61.`,
    notes: [
      "Task wording and graph labels verified against the rendered page.",
      "Line graph readings are approximate because the printed source is low resolution.",
    ],
  },
  {
    book: "04",
    page: 61,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-04/page-060-061-electricity-demand-and-use.png",
    text: `Pie chart: What the electricity is used for
1 52.5% Heating rooms, heating water
2 17.5% Ovens, kettles, washing machines
3 15% Lighting, TV, radio
4 15% Vacuum cleaners, food mixers, electric tools

WRITING TASK 2
You should spend about 40 minutes on this task.

Write about the following topic:

Happiness is considered very important in life.
Why is it difficult to define?
What factors are important in achieving happiness?

Give reasons for your answer and include any relevant examples from your
own knowledge or experience.

Write at least 250 words.`,
    notes: [
      "Pie chart labels and percentages verified against the rendered page.",
      "Writing Task 2 prompt on the same page verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 94,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-04/page-094-post-school-qualifications-gender.png",
    text: `WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the different levels of post-school qualifications in
Australia and the proportion of men and women who held them in 1999.

Summarize the information by selecting and reporting the main features,
and make comparisons where relevant.

Write at least 150 words.

Bar chart: Post-school qualifications in Australia according to gender, 1999
Legend: black bars = Females; shaded bars = Males.
Approximate percentages:
- Skilled vocational diploma: Females 10%, Males 90%.
- Undergraduate diploma: Females 70%, Males 35%.
- Bachelor's degree: Females 55%, Males 45%.
- Postgraduate diploma: Females 30%, Males 70%.
- Master's degree: Females 40%, Males 60%.`,
    notes: [
      "Task wording, chart title, legend, categories, and approximate bar values verified against the rendered page.",
      "Chart values are approximate because the source image is low resolution.",
    ],
  },
  {
    book: "05",
    page: 47,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-05/page-047-brain-areas-activated-by-jokes.png",
    text: `Test 2
Questions 21-23
The diagram below shows the areas of the brain activated by jokes.
Label the diagram.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 21-23 on your answer sheet.

Brain diagram labels:
- Right prefrontal cortex lights up - area of brain linked to 21 ______.
- 22 ______ become active too.
- Orbital prefrontal cortex is activated - involved with 23 ______.`,
    notes: [
      "Diagram prompt and the three numbered label positions verified against the rendered page.",
      "Converted the visual label positions into stable text so 22 and 23 do not get interleaved by OCR order.",
    ],
  },
  {
    book: "05",
    page: 76,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-05/page-076-garlsdon-supermarket-sites-map.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The map below is of the town of Garlsdon. A new supermarket (S) is
planned for the town. The map shows two possible sites for the
supermarket.

Summarise the information by selecting and reporting the main features,
and make comparisons where relevant.

Write at least 150 words.

Map: Garlsdon, population 65,000
Legend:
- Countryside
- Town Centre (no traffic zone)
- Housing
- Industry
- Railway
- Main roads

Possible supermarket sites:
- S1: northwest of Garlsdon, outside the town, near the main road to Hindon and close to the railway.
- S2: in the town centre/no-traffic zone.

Nearby towns:
- Hindon: 12 km, population 10,000.
- Bransdon: 16 km, population 15,000.
- Cransdon: 25 km, population 29,000.`,
    notes: [
      "Task wording, legend, site labels S1/S2, nearby towns, distances, and populations verified against the rendered page.",
      "Map geometry is represented as text plus image reference.",
    ],
  },
  {
    book: "05",
    page: 167,
    status: "calibrated",
    reason: "false_positive_text_page",
    text: `Model and sample answers for Writing tasks

TEST 3, WRITING TASK 1
MODEL ANSWER
This model has been prepared by an examiner as an example of a very good answer. However, please
note that this is just one example out of many possible approaches.

The map shows two proposed locations for a new supermarket for the town of
Garlsdon.

The first potential location (S1) is outside the town itself, and is sited just off the
main road to the town of Hindon, lying 12 kms to the north-west. This site is in the
countryside and so would be able to accommodate a lot of car parking. This would
make it accessible to shoppers from both Hindon and Garlsdon who could travel by
car. As it is also close to the railway line linking the two towns to Cransdon (25 km
to the south-east), a potentially large number of shoppers would also be able to
travel by train.

In contrast, the suggested location, S2, is right in the town centre, which would be
good for local residents. Theoretically the store could be accessed by road or rail
from the surrounding towns, including Bransdon, but as the central area is a
no-traffic zone, cars would be unable to park and access would be difficult.

Overall, neither site is appropriate for all the towns, but for customers in Cransdon,
Hindon and Garlsdon, the out-of-town site (S1) would probably offer more
advantages.`,
    notes: [
      "The page is a model-answer text page that triggered image review because it mentions a map.",
      "Text verified against the rendered page; no additional visual structure is required here.",
    ],
  },
  {
    book: "06",
    page: 59,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-06/page-059-rosewood-house-gardens-map.png",
    text: `Test 3
Questions 14-17
Label the map below.
Write the correct letter, A-J, next to questions 14-17.

ROSEWOOD HOUSE AND GARDENS
Map labels available: A, B, C, D, E, F, G, H, I, J.
Fixed labels: HOUSE; INFORMATION CENTRE.
The route/path runs from the Information Centre north toward the House.

14 Pear Alley ______
15 Mulberry Garden ______
16 Shop ______
17 Tea Room ______

Questions 18-20
Complete the sentences below.
Write ONE WORD ONLY for each answer.

RIVER WALK
18 You can walk through the ______ that goes along the river bank.
19 You can go over the ______ and then into a wooded area.
20 On your way back, you could also go up to the ______.`,
    notes: [
      "Map labels A-J, fixed labels, and Questions 14-20 text verified against the rendered page.",
      "The map is represented as stable text plus image reference.",
    ],
  },
  {
    book: "06",
    page: 75,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 3
Questions 38-40
Complete the flow-chart below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.

How a caloric-restriction mimetic works

CR mimetic
down arrow
less 38 ______ is processed
down arrow
production of ATP is decreased
branch to two theories

Theory 1:
cells less damaged by disease because fewer 39 ______ are emitted

Theory 2:
cells focus on 40 ______ because food is in short supply`,
    notes: [
      "Flow-chart wording, arrows, blanks 38-40, and theory branches verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 76,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-06/page-076-silkworm-life-cycle-and-silk-production.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The diagrams below show the life cycle of the silkworm and the stages in
the production of silk cloth.

Summarise the information by selecting and reporting the main features,
and make comparisons where relevant.

Write at least 150 words.

Life cycle of the silkworm:
1 eggs
10 days
2 silkworm larva, fed by mulberry leaf (food)
4-6 weeks
3 larva producing silk thread
3-8 days
4 cocoon
16 days
moth
cycle returns to eggs

Production of silk cloth:
Select cocoons
Boil in water
Unwind 300-900m thread
Twist thread
Dye
Weave into silk cloth`,
    notes: [
      "Task wording, lifecycle stages, timing labels, and silk production process verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 147,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a tapescript text page; it was flagged by the image-review heuristic but contains no diagram or map to structure.",
    ],
  },
  {
    book: "06",
    page: 166,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a Writing Task 1 model-answer text page; the actual silkworm diagrams were calibrated on page 76.",
    ],
  },
  {
    book: "07",
    page: 38,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-038-listening-boat-trip-map.png",
    text: `Test 2
SECTION 2 Questions 11-20

Questions 11 and 12
Label the map below.
Write NO MORE THAN TWO WORDS for each answer.

Boat Trip
Fixed stops:
- STOP A: Green Banks
- STOP C: Roman Landing

Map labels:
- STOP B: 11 ______
- STOP D: 12 ______`,
    notes: [
      "Boat-trip map labels and blanks 11-12 verified against the rendered page.",
      "The remaining Section 2 table questions continue on the following page.",
    ],
  },
  {
    book: "07",
    page: 65,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 23-25
Complete the diagram below.
Write ONE WORD AND/OR A NUMBER for each answer.

THE OPERATIONAL CYCLE

Elements:
- Global Satellite
- Meteorological station: information is analysed
- Boat

Flow:
Float dropped into ocean and 23 ______ by satellite.
Float records changes in salinity and 25 ______.
Average distance travelled: 24 ______.
Information is relayed via the global satellite to the meteorological station.`,
    notes: [
      "Diagram wording, numbered blanks, and satellite/float/meteorological-station relationships verified against the rendered page.",
      "Watermark noise was removed from the calibrated text.",
    ],
  },
  {
    book: "07",
    page: 76,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-076-reading-early-population-movement-map.png",
    text: `Test 3
Questions 20 and 21
The discussion of Williams's research indicates the periods at which early people are thought
to have migrated along certain routes. There are six routes, A-F, marked on the map below.

Complete the table below.
Write the correct letter, A-F, in boxes 20 and 21 on your answer sheet.

| Route | Period (number of years ago) |
| --- | --- |
| 20 ______ | 15,000 or more |
| 21 ______ | 600 to 700 |

Map: Early Population Movement to the Americas
Route labels: A, B, C, D, E, F.
Map labels: Asia, Bering Strait, Alaska, Canada, U.S.A., Central America, South America, Greenland.
The route arrows show movements from Asia/Bering Strait into North, Central, and South America.`,
    notes: [
      "Question wording, route table, labels A-F, and map geography verified against the rendered page.",
      "Detailed arrow geometry remains image-dependent and is preserved through the image reference.",
    ],
  },
  {
    book: "07",
    page: 82,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-082-writing-task-1-house-prices-chart.png",
    text: `Test 3
WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows information about changes in average house prices in five
different cities between 1990 and 2002 compared with the average house prices in
1989.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Percentage change in average house prices in five cities, 1990-2002 compared with 1989.
Y-axis: percentage change from 1989 prices, approximately -10 to 15.

Approximate values:
- New York (USA): 1990-1995 about -5%; 1996-2002 about +5%.
- Madrid (Spain): 1990-1995 about +2%; 1996-2002 about +4%.
- Tokyo (Japan): 1990-1995 about -7.5%; 1996-2002 about -5%.
- Frankfurt (Germany): 1990-1995 about +2%; 1996-2002 about +2%.
- London (UK): 1990-1995 about -7.5%; 1996-2002 about +12%.`,
    notes: [
      "Task wording, legend, city labels, and approximate bar values verified against the rendered page.",
      "Chart values are approximate because the source image is low resolution.",
    ],
  },
  {
    book: "07",
    page: 88,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-088-listening-olympic-site-plan.png",
    text: `Test 4
Questions 15-17
Label the plan below.
Write NO MORE THAN TWO WORDS for each answer.

OLYMPIC SITE plan
Fixed labels:
- Lake
- Island
- Stadium
- Swimming Pool
- Indoor Arena
- Station
- Benches
- Tower
- You are here
- Pond

Question labels:
15 ______ near the station, southeast of the site.
16 ______ near the benches and pond, southwest of the tower.
17 ______ near the island/lake area, north of the tower.

Questions 18-20
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Nature Reserve
| Area | Facility | Activity |
| --- | --- | --- |
| The Mangroves | boardwalk | 18 ______ |
| Frog Pond | outdoor classroom | 19 ______ |
| The Waterbird Refuge | 20 ______ | bird watching |`,
    notes: [
      "Plan labels, numbered blanks, and nature-reserve table verified against the rendered page.",
      "Spatial layout is represented as text plus image reference.",
    ],
  },
  {
    book: "07",
    page: 90,
    status: "calibrated",
    reason: "false_positive_table_page",
    text: `Test 4
Questions 27-30
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Information/visual aid | Where from?
Overhead projector | the 27 ______
Map of West Africa | the 28 ______
Map of the islands | a tourist brochure
Literacy figures | the 29 ______
30 ______ on school places | as above`,
    notes: [
      "This is a table question mentioning maps, not a page with a map to structure.",
      "Table wording and blanks 27-30 verified against the page text/image.",
    ],
  },
  {
    book: "07",
    page: 128,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `General Training: Reading and Writing
Questions 22-27
Complete the flow chart below.
Choose NO MORE THAN TWO WORDS from the text for each answer.
Write your answers in boxes 22-27 on your answer sheet.

Dealing with emails

Delete 22 ______.

Sort email according to the:
- sender
- subject
- 23 ______

Deal with emails that need your 24 ______.

If an email is easy to deal with, you should 25 ______.

If an email is complex, you can:
- first send a 26 ______
- give the sender a 27 ______ for answering their email fully`,
    notes: [
      "Flow chart title, branches, and blanks 22-27 verified against the rendered page.",
    ],
  },
  {
    book: "07",
    page: 154,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a tapescript text page; it was flagged because the dialogue mentions maps and visual aids.",
    ],
  },
  {
    book: "08",
    page: 20,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-020-reading-1670-lever-device-diagram.png",
    text: `Reading
Questions 9-13
Label the diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 9-13 on your answer sheet.

How the 1670 lever-based device worked

Diagram labels:
- escapement (resembling 9 ______)
- the 10 ______
- the 11 ______
- a 12 ______ which beats each 13 ______
- small arc`,
    notes: [
      "Diagram title, word limit, blanks 9-13, and small-arc label verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 29,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-029-writing-task-1-land-degradation-pie-chart.png",
    text: `Test 1
WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The pie chart below shows the main reasons why agricultural land becomes
less productive. The table shows how these causes affected three regions of
the world during the 1990s.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Pie chart: Causes of worldwide land degradation
- over-grazing: 35%
- deforestation: 30%
- over-cultivation: 28%
- other: 7%

Table: Causes of land degradation by region
| Region | Deforestation | Over-cultivation | Over-grazing | Total land degraded |
| --- | ---: | ---: | ---: | ---: |
| North America | 0.2 | 3.3 | 1.5 | 5% |
| Europe | 9.8 | 7.7 | 5.5 | 23% |
| Oceania* | 1.7 | 0 | 11.3 | 13% |

* A large group of islands in the South Pacific including Australia and New Zealand.`,
    notes: [
      "Task wording, pie chart percentages, table headers, region rows, and footnote verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 34,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-034-listening-agricultural-park-plan.png",
    text: `Listening
SECTION 2 Questions 11-20

Question 11
Choose the correct letter, A, B or C.

11 According to the speaker, the main purposes of the park are
A education and entertainment.
B research and education.
C research and entertainment.

Questions 12-14
Label the plan below.
Write NO MORE THAN TWO WORDS for each answer.

Agricultural Park
Fixed labels:
- Rare Breeds Section
- Grazing Area
- Experimental Crops Area
- Reception Block
- Lake
- Marsh

Question labels:
12 ______ Area, east of the Grazing Area.
The 13 ______, beside the lake in the Experimental Crops Area.
14 ______ Area, southeast of the Marsh.`,
    notes: [
      "Plan labels, compass direction, fixed areas, and blanks 12-14 verified against the rendered page.",
      "Spatial layout is represented as text plus image reference.",
    ],
  },
  {
    book: "08",
    page: 42,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-042-reading-pilkington-float-process-diagram.png",
    text: `Reading
Questions 1-8
Complete the table and diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 1-8 on your answer sheet.

Early methods of producing flat glass

| Method | Advantages | Disadvantages |
| --- | --- | --- |
| 1 ______ | Glass remained 2 ______ | Slow; 3 ______ |
| Ribbon | Could produce glass sheets of varying 4 ______; non-stop process | Glass was 5 ______; 20% of glass rubbed away; machines were expensive |

Pilkington's float process
Fixed labels: melting zone; cooling zone.
Question labels:
6 ______ at the inlet/left side.
7 ______ beneath the molten layer in the bath.
8 ______ at the rollers/output end.`,
    notes: [
      "Table structure and float-process diagram labels 6-8 verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 82,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-082-listening-red-hill-improvement-plan.png",
    text: `Listening
Questions 14-20
Label the map below.
Write the correct letter, A-H, next to questions 14-20.

Red Hill Improvement Plan
Map labels: A, B, C, D, E, F, G, H.
Street labels: Evelyn Street, Hill Street, Days Road, Carberry Street, Thomas Street.
Fixed landmark: supermarket near label B.

14 trees ______
15 wider footpaths ______
16 coloured road surface ______
17 new sign ______
18 traffic lights ______
19 artwork ______
20 children's playground ______`,
    notes: [
      "Map labels A-H, street labels, supermarket landmark, and Questions 14-20 prompts verified against the rendered page.",
      "Detailed map geometry remains image-dependent and is preserved through the image reference.",
    ],
  },
  {
    book: "08",
    page: 84,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Listening
Questions 27-30
Complete the flow-chart below.
Choose NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

Advice on exam preparation

Make sure you know the exam requirements
down arrow
Find some past papers
down arrow
Work out your 27 ______ for revision and write them on a card
down arrow
Make a 28 ______ and keep it in view
down arrow
Divide revision into 29 ______ for each day
down arrow
Write one 30 ______ about each topic
down arrow
Practise writing some exam answers`,
    notes: [
      "Flow-chart sequence and blanks 27-30 verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 99,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-099-reading-ant-collection-diagram.png",
    text: `Test 4
Questions 37-40
Label the diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 37-40 on your answer sheet.

One method of collecting ants

Diagram labels:
- some 37 ______ at the top/covering.
- 38 ______ on the material above the funnel.
- a 39 ______ across the funnel.
- funnel.
- 40 ______ in the container below.`,
    notes: [
      "Diagram title, word limit, fixed funnel label, and blanks 37-40 verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 100,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-100-writing-task-1-uk-goods-transport-graph.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The graph below shows the quantities of goods transported in the UK between
1974 and 2002 by four different modes of transport.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Line graph: Goods transported in UK (1974-2002)
Y-axis: Million tonnes, 0 to 120.
X-axis: 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002.
Series:
- road: highest throughout; about 70 in 1974, just over 80 around 1990, near 100 by 2002.
- water: about 40 in 1974, rises to about 55 in 1982, around 60 in 1990, dips around 1998, then about 65 in 2002.
- rail: about 40 in 1974, falls to around 30 in the mid-1980s and mid-1990s, then recovers to just over 40 by 2002.
- pipeline: about 5 in 1974, rises steadily to just over 20 by the mid-1990s, then remains broadly stable.`,
    notes: [
      "This graph page was not listed by the original report because it looked only for chart/diagram/map keywords.",
      "Task wording, axes, legend, and approximate trends verified against the rendered page.",
    ],
  },
  {
    book: "08",
    page: 161,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a Writing Task 1 model-answer text page; the referenced pie chart/table were calibrated on page 29.",
    ],
  },
  {
    book: "09",
    page: 22,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Reading
Questions 34-39
Complete the flow-chart below.
Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.
Write your answers in boxes 34-39 on your answer sheet.

Method of determining where the ancestors of turtles and tortoises come from

Step 1
71 species of living turtles and tortoises were examined and a total of
34 ______________ were taken from the bones of their forelimbs.

Step 2
The data was recorded on a 35 ______________ (necessary for comparing the
information).

Outcome:
Land tortoises were represented by a dense 36 ______________ of points towards
the top.
Sea turtles were grouped together in the bottom part.

Step 3
The same data was collected from some living 37 ______________ species and
added to the other results.

Outcome:
The points for these species turned out to be positioned about
38 ______________ up the triangle between the land tortoises and the sea turtles.`,
    notes: [
      "Flow-chart wording, steps 1-3, and blanks 34-38 verified against the rendered page.",
      "The final step and blank 39 continue on page 23.",
    ],
  },
  {
    book: "09",
    page: 23,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Step 4
Bones of P. quenstedti and P. talampayensis were examined in a similar way
and the results added.

Outcome:
The position of the points indicated that both these ancient creatures were
39 ______________.

Question 40
Choose the correct letter, A, B, C or D.
Write the correct letter in box 40 on your answer sheet.

According to the writer, the most significant thing about tortoises is that
A they are able to adapt to life in extremely dry environments.
B they original life form was a kind of primeval bacteria.
C they have so much in common with sea turtles.
D they have made the transition from sea to land more than once.`,
    notes: [
      "Adjacent-page continuation added because the image-dependent flow chart begins on page 22 and ends here.",
    ],
  },
  {
    book: "09",
    page: 30,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-030-listening-hinchingbrooke-park-map.png",
    text: `Listening
Question 16
For the activity on Saturday, visitors should
A come in suitable clothing.
B make sure they are able to stay for the whole day.
C tell the rangers before the event what they wish to do.

Questions 17-20
Label the map below.
Write the correct letter, A-I, next to questions 17-20.

Hinchingbrooke Park

Fixed labels:
- Lake
- East gate
- West gate
- Refreshments
- Compass: north, south, east, west

Map labels: A, B, C, D, E, F, G, H, I.

17 bird hide ______________
18 dog-walking area ______________
19 flower garden ______________
20 wooded area ______________`,
    notes: [
      "Map title, fixed labels, compass, and lettered positions A-I verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "09",
    page: 53,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-053-writing-task-1-uk-telephone-calls-chart.png",
    text: `WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the total number of minutes (in billions) of telephone
calls in the UK, divided into three categories, from 1995-2002.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: UK telephone calls, by category, 1995-2002
Y-axis: Minutes (billions), 0 to 100.
X-axis: 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002.

Series:
- Local - fixed line: about 70, 80, 88, 89, 90, 85, 80, 72-73.
- National and international - fixed line: about 38, 40, 45, 48, 50, 55, 60, 61-62.
- Mobiles (all calls): about 3, 5, 7, 9, 12, 22, 40, 45.`,
    notes: [
      "Task wording, axis, legend, years, and approximate bar values verified against the rendered page.",
      "Numerical values are approximate because the printed source is a low-resolution bar chart.",
    ],
  },
  {
    book: "09",
    page: 73,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-073-reading-tidal-power-turbine-diagram.png",
    text: `Reading
Questions 23-26
Label the diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 23-26 on your answer sheet.

Tidal power turbine diagram

Label prompts:
- Whole tower can be raised for 23 ______________ and the extraction of seaweed
  from the blades.
- Sea life not in danger due to the fact that blades are comparatively
  24 ______________.
- Air bubbles result from the 25 ______________ behind blades.
  This is known as 26 ______________.`,
    notes: [
      "Diagram label prompts and numbered blanks 23-26 verified against the rendered page.",
      "The turbine drawing itself is spatial context and remains image-dependent.",
    ],
  },
  {
    book: "09",
    page: 86,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-086-listening-water-heater-diagram.png",
    text: `Listening
Section 2 Questions 11-20

Questions 11-13
Label the diagram below.
Choose THREE answers from the box and write the correct letter, A-E, next to
questions 11-13.

A electricity indicator
B on/off switch
C reset button
D time control
E warning indicator

Water Heater

Fixed labels:
- central heating radiators
- hot water

Numbered diagram labels:
11 ______________
12 ______________
13 ______________`,
    notes: [
      "Water-heater title, option box A-E, fixed labels, and numbered callouts 11-13 verified against the rendered page.",
      "Callout positions remain image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "09",
    page: 87,
    status: "calibrated",
    reason: "false_positive_text_page",
    text: `Questions 14-18
Where can each of the following items be found?
Choose FIVE answers from the box and write the correct letter, A-G, next to
questions 14-18.

Locations
A in box on washing machine
B in cupboard on landing
C in chest of drawers
D next to window in living room
E on shelf by back door
F on top of television
G under kitchen sink

14 pillows ______________
15 washing powder ______________
16 key ______________
17 light bulbs ______________
18 map ______________`,
    notes: [
      "Adjacent page added because it continues the same Section 2 question set after the water-heater diagram.",
    ],
  },
  {
    book: "10",
    page: 22,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-10/page-022-writing-task-1-australian-household-energy-pie-charts.png",
    text: `Test 1
WRITING
WRITING TASK 1
You should spend about 20 minutes on this task.

The first chart below shows how energy is used in an average Australian
household. The second chart shows the greenhouse gas emissions which result
from this energy use.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Australian household energy use:
- heating: 42%
- water heating: 30%
- other appliances: 15%
- refrigeration: 7%
- lighting: 4%
- cooling: 2%

Australian household greenhouse gas emissions:
- water heating: 32%
- other appliances: 28%
- heating: 15%
- refrigeration: 14%
- lighting: 8%
- cooling: 3%`,
    notes: [
      "Task wording, two pie-chart titles, category labels, and percentages verified against the rendered page.",
    ],
  },
  {
    book: "10",
    page: 32,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Test 2

Changes in the economy
- service sector continues to be important
- increasing value of intellectual property
- more and more 40 ______________ workers`,
    notes: [
      "OCR source contained only the page number; visible note-completion content restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 76,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Test 4
SECTION 3 Questions 21-30

Questions 21 and 22
Choose TWO letters, A-E.

Which TWO skills did Laura improve as a result of her work placement?
A communication
B design
C IT
D marketing
E organisation

Questions 23 and 24
Choose TWO letters, A-E.

Which TWO immediate benefits did the company get from Laura's work placement?
A updates for its software
B cost savings
C an improved image
D new clients
E a growth in sales`,
    notes: [
      "OCR source contained only the page number; Section 3 questions and options restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 88,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Test 4
Questions 23-26

Reading Passage 2 has eight sections, A-H.
Which section contains the following information?
Write the correct letter, A-H, in boxes 23-26 on your answer sheet.

23 a mention of how rational thinking enabled someone to achieve physical goals
24 an account of how someone overcame a sad experience
25 a description of how someone decided to rethink their academic career path
26 an example of how someone risked his career out of a sense of duty`,
    notes: [
      "OCR source contained only the page number; questions 23-26 restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 97,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Reading
Questions 1-7

Do the following statements agree with the information given in the text on page 104?
In boxes 1-7 on your answer sheet, write

TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

1 All new houses in Australia must have smoke alarms.
2 Photoelectric smoke alarms cost less than ionization smoke alarms.
3 It takes a short time to fit most smoke alarms.
4 Any hard-wired smoke alarm must be fitted by a specialist technician.
5 You should get in touch with your local council before placing any ionisation smoke alarms in household rubbish.
6 Smoke alarms give a warning sound to indicate that battery power is low.
7 Old smoke alarms need to be checked more than once a month.`,
    notes: [
      "OCR source contained only the page number; TRUE/FALSE/NOT GIVEN instructions and questions 1-7 restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 101,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Reading
Questions 15-21

Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the text for each answer.
Write your answers in boxes 15-21 on your answer sheet.

15 Sales letters should be sent to the ______________ in a company.
16 Your letter should make as much ______________ as possible.
17 The reader's attention needs to be caught by the ______________ of your letter.
18 Letters should be sent in a ______________.
19 It is best to print the ______________ in two or more colours.
20 Consider sending a ______________ as this is more effective than a picture.
21 You should calculate the ______________ to your letter.`,
    notes: [
      "OCR source contained only the page number; sentence-completion instructions and questions 15-21 restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 116,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `General Training Reading and Writing
Questions 21-27

The text on page 123 has eight sections, A-H.
Which section mentions the following?
Write the correct letter, A-H, in boxes 21-27 on your answer sheet.

NB You may use any letter more than once.

21 the importance of good manners
22 using your contacts
23 giving adequate responses
24 getting on well with colleagues
25 the information you may need to provide
26 being honest with the interviewer
27 being punctual`,
    notes: [
      "OCR source contained only the page number; matching-question instructions and items 21-27 restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 148,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Listening and Reading Answer Keys
ACADEMIC READING

Reading Passage 1, Questions 1-13
1 ii
2 i
3 v
4 vii
5 TRUE
6 NOT GIVEN
7 NOT GIVEN
8 TRUE
9 NOT GIVEN
10 FALSE
11 source of income / industry
12 employer
13 domestic tourism

Reading Passage 2, Questions 14-26
14 C
15 B
16 H
17 B
18 E
19 sun(light)
20 upper
21 dry
22 north
23 FALSE
24 TRUE
25 NOT GIVEN
26 B

Reading Passage 3, Questions 27-40
27 B
28 F
29 I
30 G
31 D
32 C
33 A
34 D
35 C
36 NO
37 YES
38 NOT GIVEN
39 YES
40 NOT GIVEN

If you score...
0-11: you are unlikely to get an acceptable score under examination conditions and
we recommend that you spend a lot of time improving your English before you take IELTS.
12-27: you may get an acceptable score under examination conditions but we recommend
that you think about having more practice or lessons before you take IELTS.
28-40: you are likely to get an acceptable score under examination conditions but
remember that different institutions will find different scores acceptable.`,
    notes: [
      "OCR source contained only the page number; academic reading answer key restored from the rendered page.",
    ],
  },
  {
    book: "10",
    page: 154,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a model/sample answer page referring back to the pie charts calibrated on page 22, not a new image-dependent task page.",
    ],
  },
  {
    book: "10",
    page: 162,
    status: "calibrated",
    reason: "short_page_ocr_repair",
    text: `Model and sample answers for Writing tasks
TEST A, WRITING TASK 1 (GENERAL TRAINING)
MODEL ANSWER

This model has been prepared by an examiner as an example of a very good answer.
However, please note that this is just one example out of many possible approaches.

Dear Sally,

My departure date for New Zealand is drawing near, and I am busy with preparations.
I have enrolled at an institution called 'ABC English' in Wellington, for a six-month
Advanced course, full-time. It is quite expensive but I am hopeful of improving my
pronunciation, especially.

To assist in covering the costs of my study, I aim to find a part-time job. Not only
are the college fees rather high, but also I know that rental accommodation in the
capital city will not be cheap, to say nothing of food and heating expenses. So I
would very much like to arrange some temporary employment before I arrive.

I was wondering if you could ask around among your friends and colleagues to see if
anyone wants a house-cleaner, gardener, or nanny for their children. I know you have
a wide social network in Wellington which you could canvas for me, if you wouldn't
mind. I'd be so grateful.

I look forward to seeing you soon.

Best wishes,
Margot`,
    notes: [
      "OCR source contained only the page number; General Training model-answer text restored from the rendered page.",
    ],
  },
  {
    book: "11",
    page: 11,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-011-listening-farm-visitor-map.png",
    text: `Listening
Questions 15-20
Label the map below.
Write the correct letter A-I, next to Questions 15-20.

Map labels: A, B, C, D, E, F, G, H, I.
Fixed labels:
- Road
- Footpath
- Farm Yard
- Main Path
- Fish Pool
- Side Path
- Car Park
- New Barn
- You are here

15 Scarecrow ______________
16 Maze ______________
17 Cafe ______________
18 Black Barn ______________
19 Covered picnic area ______________
20 Fiddy House ______________`,
    notes: [
      "Map title, fixed labels, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "11",
    page: 22,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-022-reading-falkirk-wheel-diagram.png",
    text: `Test 1
Questions 20-26
Label the diagram below.
Choose ONE WORD from the passage for each answer.
Write your answers in boxes 20-26 on your answer sheet.

How a boat is lifted on the Falkirk Wheel

Label prompts:
- A pair of 20 ______________ are lifted in order to shut out water from canal basin.
- A 21 ______________ is taken out, enabling Wheel to rotate.
- Hydraulic motors drive 22 ______________.
- A range of different-sized 23 ______________ ensures boat keeps upright.
- Boat reaches top Wheel, then moves directly onto 24 ______________.
- Boat travels through tunnel beneath Roman 25 ______________.
- 26 ______________ raise boat 11 m to level of Union Canal.

Fixed label:
- Boat is raised, floating in one of Wheel's two gondolas.`,
    notes: [
      "Diagram title, word limit, fixed label, and numbered prompts 20-26 verified against the rendered page.",
    ],
  },
  {
    book: "11",
    page: 34,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-034-listening-theatre-ground-floor-plan.png",
    text: `Test 2
Questions 17-20
Label the plan below.
Write the correct letter, A-G, next to Questions 17-20.

Ground floor plan of theatre

Plan labels: A, B, C, D, E, F, G.
Fixed labels:
- water cooler
- double doors
- foyer
- entrance
- entrance
- road

17 box office ______________
18 theatre manager's office ______________
19 lighting box ______________
20 artistic director's office ______________`,
    notes: [
      "Plan title, fixed labels, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "11",
    page: 42,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-042-reading-mary-rose-raising-stages.png",
    text: `Test 2
Questions 9-13
Label the diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 9-13 on your answer sheet.

Raising the hull of the Mary Rose: Stages one and two

Fixed labels:
- legs
- hull of ship
- crane
- hook

Label prompts:
- 9 ______________ attached to hull by wires.
- 10 ______________ to prevent hull being sucked into mud.
- legs are placed into 11 ______________.
- hull is lowered into 12 ______________.
- 13 ______________ used as extra protection for the hull.`,
    notes: [
      "Diagram title, fixed labels, and numbered prompts 9-13 verified against the rendered page.",
    ],
  },
  {
    book: "11",
    page: 81,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-081-listening-museum-basement-plan.png",
    text: `Listening
Questions 17-20
Label the plan below.
Write the correct letter, A-H, next to Questions 17-20.

Basement of museum

Plan labels: A, B, C, D, E, F, G, H.
Fixed labels:
- sitting area
- toilets
- stairs

17 restaurant ______________
18 cafe ______________
19 baby-changing facilities ______________
20 cloakroom ______________`,
    notes: [
      "Plan title, fixed labels, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "11",
    page: 109,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a Listening transcript page with underlined answer evidence and question references, not a new image-dependent task page.",
    ],
  },
  {
    book: "11",
    page: 26,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 30-36
Complete the table below.
Choose ONE WORD from the passage for each answer.
Write your answers in boxes 30-36 on your answer sheet.

GEO-ENGINEERING PROJECTS

| Procedure | Aim |
| --- | --- |
| put a large number of tiny spacecraft into orbit far above Earth | to create a 30 __________ that would reduce the amount of light reaching Earth |
| place 31 __________ in the sea | to encourage 32 __________ to form |
| release aerosol sprays into the stratosphere | to create 33 __________ that would reduce the amount of light reaching Earth |
| fix strong 34 __________ to Greenland ice sheets | to prevent icebergs moving into the sea |
| plant trees in the Russian Arctic that would lose their leaves in winter | to allow the 35 __________ to reflect radiation |
| change the direction of 36 __________ | to bring more cold water into ice-forming areas |`,
    notes: ["Rebuilt the six-row Geo-engineering Projects table and preserved all procedure/aim relationships for Questions 30-36."],
  },
  {
    book: "11",
    page: 28,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-028-writing-task-1-water-use-pie-charts.png",
    notes: ["Restored all six regional water-use pie charts, every percentage and the industrial/agricultural/domestic legend."],
  },
  {
    book: "11",
    page: 52,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-052-writing-task-1-language-pie-charts.png",
    notes: ["Restored the 2000 and 2010 British-student language pie charts with both complete legends and all percentages."],
  },
  {
    book: "11",
    page: 59,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3 — Questions 21-30

Questions 21-26
Complete the table below.
Write ONE WORD ONLY for each answer.

| Subject of drawing | Change to be made |
| --- | --- |
| A 21 __________ surrounded by trees | Add Malcolm and a 22 __________ noticing him. |
| People who are 23 __________ outside the forest | Add Malcolm sitting on a tree trunk and 24 __________. |
| Ice-skaters on 25 __________ covered with ice | Add a 26 __________ for each person. |`,
    notes: ["Rebuilt the three-row drawing-revisions table with all six answer gaps and correct row pairings."],
  },
  {
    book: "11",
    page: 75,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-075-writing-task-1-co2-line-graph.png",
    notes: ["Restored the 1967-2007 carbon-dioxide line graph with complete axes and all four country series."],
  },
  {
    book: "11",
    page: 78,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `TEST 4 — LISTENING — SECTION 1 — Questions 1-10

Questions 1-7
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Event | Cost | Venue | Notes |
| --- | --- | --- | --- |
| Jazz band | Example: tickets available for £15 | The 1 __________ school | Also appearing: Carolyn Hart (plays the 2 __________). |
| Duck races | £1 per duck | Start behind the 3 __________. | Prize: tickets for 4 __________ held at the end of the festival. Ducks can be bought in the 5 __________. |
| Flower show | Free | 6 __________ Hall | Prizes presented at 5 pm by a well-known 7 __________. |`,
    notes: ["Rebuilt the festival-events table with all costs, venues, notes and Questions 1-7 gaps."],
  },
  {
    book: "11",
    page: 98,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-11/page-098-writing-task-1-museum-satisfaction-pie-charts.png",
    appendText: `Total number of visitors to Ashdown Museum

| Period | Total visitors |
| --- | ---: |
| During the year before refurbishment | 74,000 |
| During the year after refurbishment | 92,000 |`,
    notes: ["Recreated both before/after satisfaction pie charts with Image 2 and rebuilt the visitor totals as a Markdown table instead of embedding scanned table text."],
  },
  ...[3, 7, 8, 9, 19, 23, 24, 35, 39, 58, 91, 101, 102, 105, 110, 113, 122, 130, 132, 134, 136, 142].map((page) => ({
    book: "11",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 11 page ${page}: the visual keyword occurs in instructions, passage/transcript prose, answer keys, sample-answer commentary or acknowledgements; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "12",
    page: 27,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-12/page-027-writing-physical-activity-bar-chart.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The bar chart below shows the percentage of Australian men and women in
different age groups who did regular physical activity in 2010.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Percentage of Australian men and women doing regular physical activity: 2010
Y-axis: Percentage (%), 0 to 60.
Age groups and values:
- 15 to 24: Male 52.8, Female 47.7
- 25 to 34: Male 42.2, Female 48.9
- 35 to 44: Male 39.5, Female 52.5
- 45 to 54: Male 43.1, Female 53.3
- 55 to 64: Male 45.1, Female 53.0
- 65 and over: Male 46.7, Female 47.1`,
    notes: [
      "Task wording, axis, legend, age groups, and bar values verified against the rendered page.",
    ],
  },
  {
    book: "12",
    page: 34,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 6
Questions 26-30
Complete the flow-chart below.
Choose FIVE answers from the box and write the correct letter, A-G, next to Questions 26-30.

A bullet points
B film
C notes
D structure
E student paper
F textbook
G documentary

How James will write his paper on the Vikings
- He'll read a 26 ______________ and choose his topic.
- He'll borrow a 27 ______________ from Beth.
- He'll plan the 28 ______________ of the paper.
- He'll read some source material and write 29 ______________.
- He'll write the paper using 30 ______________.
- He'll write the complete paper.`,
    notes: [
      "Option box and flow-chart steps 26-30 verified against the rendered page.",
    ],
  },
  {
    book: "12",
    page: 56,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 7
SECTION 3 Questions 21-30

Questions 21-26
Complete the flow-chart below.
Choose SIX answers from the box and write the correct letter, A-H, next to Questions 21-26.

A patterns
B names
C sources
D questions
E employees
F solutions
G headings
H officials

STAGES IN DOING A TOURISM CASE STUDY

RESEARCH
- Locate and read relevant articles, noting key information and also 21 ______________.
- Identify a problem or need.
- Select interviewees - these may be site 22 ______________, visitors or city 23 ______________.
- Prepare and carry out interviews. If possible, collect statistics.
- Check whether 24 ______________ of interviewees can be used.

ANALYSIS
- Select relevant information and try to identify 25 ______________.
- Decide on the best form of visuals.

WRITING THE CASE STUDY
- Give some background before writing the main sections.
- Do NOT end with 26 ______________.`,
    notes: [
      "Option box, section headings, and flow-chart blanks 21-26 verified against the rendered page.",
    ],
  },
  {
    book: "12",
    page: 71,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-12/page-071-writing-fast-food-frequency-chart.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows how frequently people in the USA ate in fast food
restaurants between 2003 and 2013.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Frequency of eating at fast food restaurants among people in the USA (2003-2013)
Y-axis: % of people, 0% to 40%.
Categories and approximate values:
- Every day: 2003 about 4%, 2006 about 3%, 2013 about 3%.
- Several times a week: 2003 about 17%, 2006 about 20%, 2013 about 16%.
- Once a week: 2003 about 31%, 2006 about 33%, 2013 about 28%.
- Once or twice a month: 2003 about 30%, 2006 about 25%, 2013 about 33%.
- A few times a year: 2003 about 13%, 2006 about 15%, 2013 about 15%.
- Never: 2003 about 5%, 2006 about 4%, 2013 about 4%.`,
    notes: [
      "Task wording, axis, legend, categories, and approximate bar values verified against the rendered page.",
      "Numerical values are approximate because the printed chart is low resolution.",
    ],
  },
  {
    book: "12",
    page: 76,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-12/page-076-listening-sheepmarket-map.png",
    text: `Test 8
Questions 15-20
Label the map below.
Write the correct letter, A-I, next to Questions 15-20.

Art and History in the Sheepmarket

Map labels: A, B, C, D, E, F, G, H, I.
Fixed labels:
- compass: N, S, E, W
- Hill Road
- City Road
- Crawley Road
- Bank
- Station Square
- Public Gardens

15 The Reynolds House ______________
16 The Thumb ______________
17 The Museum ______________
18 The Contemporary Art Gallery ______________
19 The Warner Gallery ______________
20 Nucleus ______________`,
    notes: [
      "Map title, fixed labels, compass, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "12",
    page: 92,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-12/page-092-writing-geothermal-power-plant.png",
    text: `Test 8
WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how geothermal energy is used to produce electricity.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: Geothermal power plant
Stages and labels:
1 Cold water.
2 The injection well; cold water pumped down 4.5 km.
3 The production well; hot water pumped up.
4 Condenser; steam.
5 Turbine and generator.

Fixed labels:
- Geothermal zone (hot rocks)
- Generator: powered by turbine and produces electricity
- Turbine: powered by steam`,
    notes: [
      "Task wording, process title, stage numbers, depth label, and fixed labels verified against the rendered page.",
    ],
  },
  {
    book: "12",
    page: 124,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a sample-answer page referring back to the physical-activity bar chart calibrated on page 27.",
    ],
  },
  {
    book: "12",
    page: 126,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a sample-answer page referring to maps from the writing task, not a new question page requiring image calibration.",
    ],
  },
  {
    book: "12",
    page: 130,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a sample-answer page referring back to the geothermal process diagram calibrated on page 92.",
    ],
  },
  {
    book: "12",
    page: 48,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 27-31
Complete the table below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 27-31 on your answer sheet.

| Test | Findings |
| --- | --- |
| Observing the 27 __________ of Russian-English bilingual people when asked to select certain objects | Bilingual people engage both languages simultaneously: a mechanism known as 28 __________. |
| A test called the 29 __________, focusing on naming colours | Bilingual people are more able to handle tasks involving a skill called 30 __________. |
| A test involving switching between tasks | When changing strategies, bilingual people have superior 31 __________. |`,
    notes: ["Rebuilt the bilingualism tests/findings table and restored all five answer gaps in their correct cells."],
  },
  {
    book: "12",
    page: 50,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-12/page-050-writing-task-1-islip-maps.png",
    notes: ["Restored both Islip town-centre maps, including compass directions, all current features and every planned development label."],
  },
  {
    book: "12",
    page: 55,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 18-20
Complete the table below.
Write ONE WORD ONLY for each answer.

Fitness Holidays

| Location | Main focus | Other comments |
| --- | --- | --- |
| Ireland and Italy | general fitness | personally designed programme; also reduces 18 __________ |
| Greece | 19 __________ control | includes exercise on the beach |
| Morocco | mountain biking | wide variety of levels; one holiday specially designed for 20 __________ |`,
    notes: ["Rebuilt the Fitness Holidays table with all locations, focuses, comments and Questions 18-20 gaps."],
  },
  {
    book: "12",
    page: 77,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3 — Questions 21-30

Questions 21-24
Complete the table below.
Write ONE WORD ONLY for each answer.

Presentation on film adaptations of Shakespeare's plays

| Stages of presentation | Work still to be done |
| --- | --- |
| Introduce Giannetti's book containing a 21 __________ of adaptations. | Organise notes. |
| Ask class to suggest the 22 __________ adaptations. | No further work needed. |
| Present Rachel Malchow's ideas. | Prepare some 23 __________. |
| Discuss relationship between adaptations and 24 __________ at the time of making the film. | No further work needed. |`,
    notes: ["Rebuilt the four-stage film-adaptations presentation table with all remaining-work pairings and answer gaps."],
  },
  ...[5, 9, 21, 25, 43, 46, 53, 54, 61, 64, 74, 79, 95, 96, 101, 102, 108, 111, 112, 114, 116, 127, 128, 136].map((page) => ({
    book: "12",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 12 page ${page}: the visual keyword occurs in introductory, passage, notes, transcript, answer-key, sample-answer or acknowledgement text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "13",
    page: 13,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-13/page-013-listening-granford-traffic-map.png",
    text: `Test 1
Questions 14-20
Label the map below.
Write the correct letter, A-I, next to Questions 14-20.

Proposed traffic changes in Granford

Map labels: A, B, C, D, E, F, G, H, I.
Fixed labels:
- compass: N, S, E, W
- Station Road
- High Street
- School Road
- Bank
- Chemist
- Library
- School
- Supermarket
- Supermarket

14 New traffic lights ______________
15 Pedestrian crossing ______________
16 Parking allowed ______________
17 New 'No Parking' sign ______________
18 New disabled parking spaces ______________
19 Widened pavement ______________
20 Lorry loading/unloading restrictions ______________`,
    notes: [
      "Map title, fixed labels, compass, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "13",
    page: 15,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 1
Questions 26-30
Complete the flow-chart below.
Choose FIVE answers from the box and write the correct letter, A-H, next to Questions 26-30.

A container
B soil
C weight
D condition
E height
F colour
G types
H depths

Stages in the experiment
- Select seeds of different 26 ______________ and sizes.
- Measure and record the 27 ______________ and size of each one.
- Decide on the 28 ______________ to be used.
- Use a different 29 ______________ for each seed and label it.
- After about 3 weeks, record the plant's 30 ______________.
- Investigate the findings.`,
    notes: [
      "Option box and flow-chart steps 26-30 verified against the rendered page.",
    ],
  },
  {
    book: "13",
    page: 52,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-13/page-052-writing-housing-tenure-chart.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the percentage of households in owned and rented
accommodation in England and Wales between 1918 and 2011.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Households owning and renting accommodation in England and Wales 1918 to 2011
Y-axis: % of households, 0 to 90.
Approximate values:
- 1918: owned 22%, rented 78%
- 1939: owned 31%, rented 69%
- 1953: owned 32%, rented 68%
- 1961: owned 42%, rented 58%
- 1971: owned 50%, rented 50%
- 1981: owned 60%, rented 40%
- 1991: owned 68%, rented 32%
- 2001: owned 69%, rented 31%
- 2011: owned 64%, rented 36%`,
    notes: [
      "Task wording, axis, legend, years, and approximate bar values verified against the rendered page.",
      "Numerical values are approximate because the printed chart is low resolution.",
    ],
  },
  {
    book: "13",
    page: 72,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-13/page-072-writing-electricity-production-consumption-chart.png",
    text: `Writing
WRITING TASK 1
You should spend about 20 minutes on this task.

The bar chart below shows the top ten countries for the production and
consumption of electricity in 2014.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Electricity
Units: billion kWh.

Ranked countries: production / consumption
1 China: 5,398 / 5,322
2 United States: 4,099 / 3,866
3 Russia: 1,057 / 1,038
4 Japan: 936.2 / 856.7
5 India: 871 / 698.8
6 Canada: 618.9 / 499.9
7 France: 561.2 / 462.9
8 Brazil: 530.7 / 455.8
9 Germany: 526.6 / 582.5
10 Korea, Rep.: 485.1 / 449.5`,
    notes: [
      "Task wording, legend, countries, and printed electricity values verified against the rendered page.",
    ],
  },
  {
    book: "13",
    page: 97,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is an Audioscripts page with underlined answer evidence and question references, not a new map question page.",
    ],
  },
  {
    book: "13",
    page: 125,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a sample-answer page referring to the Test 1 Writing Task 1 maps, not a new question page requiring image calibration.",
    ],
  },
  {
    book: "13",
    page: 11,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `TEST 1 — LISTENING — SECTION 1 — Questions 1-10

Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

COOKERY CLASSES

| Cookery Class | Focus | Other Information |
| --- | --- | --- |
| Example: The Food Studio | how to 1 __________ and cook with seasonal products | small classes; also offers 2 __________ classes; returning clients get a 3 __________ discount |
| Bond's Cookery School | food that is 4 __________ | includes recipes to strengthen your 5 __________; a free 6 __________ every Thursday |
| The 7 __________ Centre | mainly 8 __________ food | located near the 9 __________; a special course in skills with a 10 __________ is sometimes available |`,
    notes: ["Rebuilt the Cookery Classes table with all three providers, grouped details and Questions 1-10 gaps."],
  },
  {
    book: "13",
    page: 19,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 1-7
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-7 on your answer sheet.

| Section of website | Comments |
| --- | --- |
| Database of tourism services | easy for tourism-related businesses to get on the list; allowed businesses to 1 __________ information regularly; provided a country-wide evaluation of businesses, including their impact on the 2 __________ |
| Special features on local topics | e.g. an interview with a former sports 3 __________, and an interactive tour of various locations used in 4 __________ |
| Information on driving routes | varied depending on the 5 __________ |
| Travel Planner | included a map showing selected places, details of public transport and local 6 __________ |
| 'Your Words' | travellers could send a link to their 7 __________ |`,
    notes: ["Rebuilt the Tourism New Zealand website table with its five sections and Questions 1-7 gaps."],
  },
  {
    book: "13",
    page: 30,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-13/page-030-writing-task-1-city-hospital-maps.png",
    notes: ["Restored both 2007 and 2010 city-hospital access maps with compass, roads, bus facilities, roundabouts and separate car parks."],
  },
  {
    book: "13",
    page: 61,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 1-8
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-8 on your answer sheet.

THE COCONUT PALM

| Part | Description | Uses |
| --- | --- | --- |
| trunk | up to 30 metres | timber for houses and the making of 1 __________ |
| leaves | up to 6 metres long | to make brushes |
| flowers | at the top of the trunk | stems provide sap, used as a drink or a source of 2 __________ |
| fruits: outer layer | | |
| fruits: middle layer (coir fibres) | | used for 3 __________, etc. |
| fruits: inner layer (shell) | | a source of 4 __________; when halved, for 5 __________ |
| fruits: coconut water | | a drink; a source of 6 __________ for other plants |
| fruits: coconut flesh | | oil and milk for cooking and 7 __________; glycerine (an ingredient in 8 __________) |`,
    notes: ["Rebuilt the Coconut Palm table, preserving the nested fruit layers and all eight uses-based answer gaps."],
  },
  {
    book: "13",
    page: 93,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-13/page-093-writing-task-1-sports-centre-plans.png",
    notes: ["Restored the present and future university sports-centre plans with compass, entrances and every facility label."],
  },
  ...[6, 10, 14, 17, 18, 85, 89, 91, 98, 99, 104, 127, 129, 132].map((page) => ({
    book: "13",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 13 page ${page}: the visual keyword occurs in introductory, passage, ordinary question, transcript or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "14",
    page: 34,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-14/page-034-listening-branley-castle-map.png",
    text: `Test 2
Questions 16-20
Label the plan below.
Write the correct letter, A-H, next to Questions 16-20.

Branley Castle

Plan labels: A, B, C, D, E, F, G, H.
Fixed labels:
- compass: N, S, E, W
- River
- North gate
- South gate
- Great Hall
- Tower
- Walls
- Main entrance

16 Starting point for walking the walls ______________
17 Bow and arrow display ______________
18 Hunting birds display ______________
19 Traditional dancing ______________
20 Shop ______________`,
    notes: [
      "Plan title, fixed labels, compass, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "14",
    page: 50,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-14/page-050-writing-task-1-export-earnings-chart.png",
    text: `Test 2
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the value of one country's exports in various categories
during 2015 and 2016. The table shows the percentage change in each category
of exports in 2016 compared with 2015.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Export Earnings (2015-2016)
Y-axis: $ billions, 10 to 70.
Approximate values:
- Petroleum products: 2015 about 61, 2016 about 63.
- Engineered goods: 2015 about 58, 2016 about 62.
- Gems and jewellery: 2015 about 43, 2016 about 41.
- Agricultural products: 2015 about 31, 2016 about 32.
- Textiles: 2015 about 26, 2016 about 31.

Table: Percentage change in values (2015-2016)
| Product category | Percentage change in value, 2015-2016 |
| --- | ---: |
| Petroleum products | +3% |
| Engineered goods | +8.5% |
| Gems and jewellery | -5.18% |
| Agricultural products | +0.81% |
| Textiles | +15.24% |`,
    notes: [
      "Task wording, chart title, axis, table labels, and percentage changes verified against the rendered page.",
      "Bar values are approximate because the printed chart is low resolution.",
    ],
  },
  {
    book: "14",
    page: 72,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-14/page-072-writing-task-1-hydroelectric-power-station.png",
    text: `Test 3
WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how electricity is generated in a hydroelectric power station.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: Hydroelectric power station
Fixed labels:
- River
- High-level reservoir
- Dam
- Intake: Day open, Night closed
- Flow of water to generate electricity (day)
- Flow of water during pumping (night)
- Power station
- Generator
- Power lines to National grid
- Low-level reservoir
- Reversible turbines: Day operate generator; Night pump water into high-level reservoir`,
    notes: [
      "Task wording, diagram title, day/night labels, and process labels verified against the rendered page.",
    ],
  },
  {
    book: "14",
    page: 127,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is a sample-answer page referring to the Test 1 Writing Task 1 nutrition pie charts, not a new image-dependent task page.",
    ],
  },
  {
    book: "14",
    page: 29,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-14/page-029-writing-task-1-nutrient-pie-charts.png",
    notes: ["Recreated with Image 2 as a clean high-resolution infographic; verified all 12 meal percentages, three nutrient titles and the four-item shared legend against the original."],
  },
  {
    book: "14",
    page: 94,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-14/page-094-writing-task-1-grange-park-plans.png",
    notes: ["Recreated with Image 2 as clean high-resolution plans; verified every 1920/today feature, entrance, road label and relative position against the original."],
  },
  ...[5, 9, 11, 20, 21, 35, 63, 81, 91, 100, 101, 104, 105, 106, 109, 115, 117, 125, 130].map((page) => ({
    book: "14",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 14 page ${page}: the visual keyword occurs in introductory, passage, ordinary-question, notes, transcript, answer-key or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "15",
    page: 30,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-030-writing-task-1-coffee-tea-habits-chart.png",
    text: `Test 1
WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the results of a survey about people's coffee and tea
buying and drinking habits in five Australian cities.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Bar chart: Coffee and tea buying and drinking habits in five cities in Australia
Y-axis: Percentage of city residents, 20% to 70%.
Approximate values:
- Sydney: fresh coffee 44%, instant coffee 46%, cafe coffee/tea 61%.
- Melbourne: fresh coffee 43%, instant coffee 48%, cafe coffee/tea 64%.
- Brisbane: fresh coffee 34%, instant coffee 53%, cafe coffee/tea 55%.
- Adelaide: fresh coffee 34%, instant coffee 50%, cafe coffee/tea 49%.
- Hobart: fresh coffee 38%, instant coffee 54%, cafe coffee/tea 63%.`,
    notes: [
      "Task wording, chart title, axis, legend, city labels, and approximate bar values verified against the rendered page.",
      "Numerical values are approximate because the printed chart is low resolution.",
    ],
  },
  {
    book: "15",
    page: 35,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-035-listening-minster-park-map.png",
    text: `Listening
Questions 15-20
Label the map below.
Write the correct letter, A-I, next to Questions 15-20.

Minster Park

Map labels: A, B, C, D, E, F, G, H, I.
Fixed labels:
- north arrow
- River
- West gate
- East gate
- South gate
- Lily pond

15 statue of Diane Gosforth ______________
16 wooden sculptures ______________
17 playground ______________
18 maze ______________
19 tennis courts ______________
20 fitness area ______________`,
    notes: [
      "Map title, fixed labels, north arrow, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "15",
    page: 73,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-073-writing-task-1-instant-noodles-process.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how instant noodles are manufactured.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: Manufacturing instant noodles
Stages and labels:
1 Storage silos; flour.
2 Mixer; water and oil added.
3 Dough sheets; rollers.
4 Dough strips.
5 Noodles discs.
6 Cooking (oil) and drying.
7 Vegetables and spices added; cups.
8 Labelling and sealing; labels.`,
    notes: [
      "Task wording, diagram title, stage numbers, and process labels verified against the rendered page.",
    ],
  },
  {
    book: "15",
    page: 77,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-077-listening-croft-valley-park-map.png",
    text: `Listening
PART 2 Questions 11-20

Questions 11-16
Label the map below.
Write the correct letter, A-H, next to Questions 11-16.

Croft Valley Park

Map labels: A, B, C, D, E, F, G, H.
Fixed labels:
- compass: N, S, E, W
- North gate
- South gate
- Adventure playground
- Old museum
- Lake
- Glass houses

11 cafe ______________
12 toilets ______________
13 formal gardens ______________
14 outdoor gym ______________
15 skateboard ramp ______________
16 wild flowers ______________`,
    notes: [
      "Map title, fixed labels, compass, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "15",
    page: 95,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-095-writing-task-1-anthropology-graduate-destinations-pie.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows what Anthropology graduates from one university did after
finishing their undergraduate degree course. The table shows the salaries of the
anthropologists in work after five years.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Pie chart: Destination of Anthropology graduates (from one university)
- Full-time work: 52%
- Part-time work: 15%
- Part-time work + postgrad study: 5%
- Full-time postgrad study: 8%
- Unemployed: 12%
- Not known: 8%

Table: Salaries of Anthropology graduates (after 5 years' work)
| Type of employment | $25,000-49,999 | $50,000-74,999 | $75,000-99,999 | $100,000+ |
| --- | ---: | ---: | ---: | ---: |
| Freelance consultants | 5% | 15% | 40% | 40% |
| Government sector | 5% | 15% | 30% | 50% |
| Private companies | 10% | 35% | 25% | 30% |`,
    notes: [
      "Task wording, pie chart categories, percentages, salary bands, and table values verified against the rendered page.",
    ],
  },
  {
    book: "15",
    page: 144,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is an acknowledgements/copyright page with source references, not a question page requiring image calibration.",
    ],
  },
  {
    book: "15",
    page: 14,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 15-20
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

Timetable for Isle of Man holiday

| Day | Activity | Notes |
| --- | --- | --- |
| Day 1 | Arrive | Introduction by manager. Hotel dining room has view of the 15 __________. |
| Day 2 | Tynwald Exhibition and Peel | Tynwald may have been founded in 16 __________, not 979. |
| Day 3 | Trip to Snaefell | Travel along promenade in a tram; train to Laxey; train to the 17 __________ of Snaefell. |
| Day 4 | Free day | Company provides a 18 __________ for local transport and heritage sites. |
| Day 5 | Take the 19 __________ railway train from Douglas to Port Erin | Free time, then coach to Castletown - former 20 __________ has old castle. |
| Day 6 | Leave | Leave the island by ferry or plane. |`,
    notes: ["Rebuilt the six-day Isle of Man timetable in code with all activities, notes and Questions 15-20 gaps."],
  },
  {
    book: "15",
    page: 21,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 8-13
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 8-13 on your answer sheet.

| Period | Events in the history of nutmeg |
| --- | --- |
| Middle Ages | Nutmeg was brought to Europe by the 8 __________. |
| 16th century | European nations took control of the nutmeg trade. |
| 17th century | Demand grew because nutmeg was believed effective against the disease known as the 9 __________. The Dutch took control of the Banda Islands, restricted production, put 10 __________ on nutmeg to prevent cultivation elsewhere, and finally obtained the island of 11 __________ from the British. |
| Late 18th century | 1770 - nutmeg plants were secretly taken to 12 __________. 1778 - half the Banda Islands' nutmeg plantations were destroyed by a 13 __________. |`,
    notes: ["Rebuilt the chronological nutmeg-history table in code, preserving nested Dutch actions and all Questions 8-13 gaps."],
  },
  {
    book: "15",
    page: 33,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `TEST 2 — LISTENING — PART 1 — Questions 1-10

Questions 1-4
Complete the table below.
Write ONE WORD ONLY for each answer.

Festival information

| Date | Type of event | Details |
| --- | --- | --- |
| 17th | a concert | performers from Canada |
| 18th | a ballet | company called 1 __________ |
| 19th-20th (afternoon) | a play | type of play: a comedy called *Jemima*; has had a good 2 __________ |
| 20th (evening) | a 3 __________ show | show is called 4 __________ |`,
    notes: ["Rebuilt the Festival information table in code with all dates, event types, details and Questions 1-4 gaps."],
  },
  {
    book: "15",
    page: 51,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-15/page-051-writing-task-1-caribbean-tourists-graph.png",
    notes: ["Recreated with Image 2 as a high-resolution line chart; verified 24 points across 2010-2017, the 0-4 million scale, all three line/marker encodings and legend labels."],
  },
  ...[7, 8, 11, 84, 85, 99, 105, 115, 116, 117, 118, 129, 131, 132, 138, 145].map((page) => ({
    book: "15",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 15 page ${page}: the visual keyword occurs in introductory, ordinary-question, passage, transcript, sample-answer or promotional text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "16",
    page: 14,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-014-listening-stevensons-site-plan.png",
    text: `Test 1
Questions 15-20
Label the map below.
Write the correct letter, A-J, next to Questions 15-20.

Plan of Stevenson's site

Map labels: A, B, C, D, E, F, G, H, I, J.
Fixed labels:
- FACTORY
- OPEN COURTYARD
- RECEPTION
- ACCESS ROAD
- MAIN ROAD

15 coffee room ______________
16 warehouse ______________
17 staff canteen ______________
18 meeting room ______________
19 human resources ______________
20 boardroom ______________`,
    notes: [
      "Site-plan title, fixed labels, letter labels, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "16",
    page: 38,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 2
Questions 25-30
Complete the flow chart below.
Write ONE WORD ONLY for each answer.

Assignment plan

Decide on research question:
Is there a relationship between hours of sleep and number of dreams?

Decide on sample:
Twelve students from the 25 ______________ department.

Decide on methodology:
Self-reporting.

Decide on procedure:
Answers on 26 ______________.

Check ethical guidelines for working with 27 ______________.
Ensure that risk is assessed and 28 ______________ is kept to a minimum.

Analyse the results:
Calculate the correlation and make a 29 ______________.

30 ______________ the research.`,
    notes: [
      "Flow-chart title, word limit, and blanks 25-30 verified against the rendered page.",
    ],
  },
  {
    book: "16",
    page: 54,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-054-writing-task-1-sugar-cane-process.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows the manufacturing process for making sugar from sugar cane.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: How sugar is produced from sugar cane
Stages and labels:
1 Growing (12-18 months); sugar canes.
2 Harvesting.
3 Crushing; sugar canes; juice.
4 Purifying juice; limestone filter.
5 Evaporator; juice becomes syrup; heat.
6 Centrifuge; separates sugar crystals from syrup.
7 Drying and cooling; sugar.`,
    notes: [
      "Task wording, diagram title, stage numbers, and process labels verified against the rendered page.",
    ],
  },
  {
    book: "16",
    page: 80,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-080-listening-recreation-ground-map.png",
    text: `Test 4
Questions 15-20
Label the map below.
Write the correct letter, A-I, next to Questions 15-20.

Recreation ground after proposed changes

Map labels: A, B, C, D, E, F, G, H, I.
Fixed labels:
- compass: N, S, E, W
- River
- Road
- Field
- Community Hall
- Key: footpath

15 New car park ______________
16 New cricket pitch ______________
17 Children's playground ______________
18 Skateboard ramp ______________
19 Pavilion ______________
20 Notice board ______________`,
    notes: [
      "Map title, fixed labels, compass, letter labels, key, and question list verified against the rendered page.",
      "Spatial layout remains image-dependent; keep the image reference for the live question view.",
    ],
  },
  {
    book: "16",
    page: 97,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-097-writing-task-1-plastic-bottle-recycling-process.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows the process for recycling plastic bottles.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: How plastic bottles are recycled
Stages and labels:
1 Bottles are placed in a recycling bin.
2 Bottles are collected by truck.
3 Recycling centre: sorting.
4 Compressing into blocks.
5 Crushing; washing.
6 Producing plastic pellets.
7 Heating pellets to form raw material.
8 Raw material.
9 Producing end products.`,
    notes: [
      "Task wording, diagram title, stage numbers, and process labels verified against the rendered page.",
    ],
  },
  {
    book: "16",
    page: 144,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is an acknowledgements/copyright page with source references, not a question page requiring image calibration.",
    ],
  },
  {
    book: "16",
    page: 21,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 8-13
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 8-13 on your answer sheet.

Reasons why polar bears should be protected

| Topic | Evidence |
| --- | --- |
| Intelligence | People think of bears as unintelligent and 8 __________, but this may be incorrect. |
| Tool use | In Tennoji Zoo, a bear used a branch as a 9 __________, allowing him to knock down some 10 __________. |
| Problem solving | A wild polar bear worked out how to reach a platform where a 11 __________ was located. |
| Complex behaviour | Polar bears have consciously manipulated objects and shown activity similar to a 12 __________. |
| Emotions | They may make movements suggesting 13 __________ when disappointed during hunting, and may form relationships with other species. |`,
    notes: ["Rebuilt the boxed polar-bear evidence table in code and preserved all Questions 8-13 relationships."],
  },
  {
    book: "16",
    page: 31,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-031-writing-task-1-appliances-housework-charts.png",
    notes: ["Recreated with Image 2; verified all 18 appliance-ownership points, six housework-hour points, axes, legends and footnote."],
  },
  {
    book: "16",
    page: 75,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-075-writing-task-1-southwest-airport-plans.png",
    notes: ["Recreated with Image 2; verified present gates 1-8, future gates 1-18, concourse topology, processing zones, facilities and both legends."],
  },
  {
    book: "16",
    page: 86,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-16/page-086-reading-qanat-diagrams.png",
    notes: ["Recreated with Image 2; verified both qanat cross-sections, all fixed labels and arrows, and kept Questions 1-6 blanks empty."],
  },
  ...[7, 8, 11, 13, 15, 23, 36, 37, 73, 79, 93, 101, 102, 107, 109, 112, 118, 119, 125, 131, 132, 135].map((page) => ({
    book: "16",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 16 page ${page}: the visual keyword occurs in introductory, passage, ordinary-question, transcript, answer-key or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "17",
    page: 65,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-17/page-065-writing-task-1-family-spending-chart.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below gives information about how families in one country spent their
weekly income in 1968 and in 2018.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Chart: 1968 and 2018: average weekly spending by families
Unit: percentage of weekly income

| Category | 1968 | 2018 |
| --- | ---: | ---: |
| Food | 35 | 17 |
| Housing | 10 | 19 |
| Fuel and power | 6 | 4 |
| Clothing and footwear | 10 | 5 |
| Household goods | 8 | 8 |
| Personal goods | 8 | 4 |
| Transport | 8 | 14 |
| Leisure | 9 | 22 |`,
    notes: [
      "Task wording, chart title, legend, categories, and approximate bar values verified against the rendered page.",
      "Corrected OCR noise and misspelling of footwear; the chart image is embedded for visual reference.",
    ],
  },
  {
    book: "17",
    page: 21,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-17/page-021-writing-task-1-norbiton-maps.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The maps below show an industrial area in the town of Norbiton, and planned
future development of the site.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.`,
    notes: [
      "Recreated with Image 2; verified the present industrial estate, eight factories, river, farmland, town and compass.",
      "Verified the planned road and bridge layout, housing areas, shops, medical centre, playground and school.",
    ],
  },
  {
    book: "17",
    page: 43,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-17/page-043-writing-task-1-police-budget-pie-charts.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The table and charts below give information on the police budget for 2017 and
2018 in one area of Britain. The table shows where the money came from and
the charts show how it was distributed.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Police Budget 2017-2018 (in £m)

| Sources | 2017 | 2018 |
| --- | ---: | ---: |
| National Government | 175.5m | 177.8m |
| Local Taxes | 91.2m | 102.3m |
| Other sources (eg grants) | 38m | 38.5m |
| Total | 304.7m | 318.6m |`,
    notes: [
      "Rebuilt the police-budget source table in code with every heading, row and value preserved.",
      "Recreated the spending pie charts with Image 2; verified 2017 values 75/8/17 and 2018 values 69/14/17 plus all legend labels.",
    ],
  },
  {
    book: "17",
    page: 77,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-13
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 7-13 on your answer sheet.

The study carried out by Rocha's team

| Phase | Details |
| --- | --- |
| Aim | to investigate the feeding habits of bats in farmland near the Ranomafana National Park |
| Method | ultrasonic recording to identify favourite feeding spots; DNA analysis of bat 7 __________ |
| Findings: activity | the bats were most active in rice fields located on hills |
| Findings: crop pests | the bats ate pests of rice, 8 __________, sugarcane, nuts and fruit |
| Findings: disease | the bats prevent the spread of disease by eating 9 __________ and blackflies |
| Local attitudes: benefit | the bats provide food rich in 10 __________ |
| Local attitudes: problem | the buildings where they roost become 11 __________ |
| Local attitudes: culture | the bats play an important role in local 12 __________ |
| Recommendation | farmers should provide special 13 __________ to support the bat population |`,
    notes: [
      "Rebuilt the Rocha study table in code and preserved its Aim, Method, Findings, local-attitude and Recommendation hierarchy.",
      "Verified Questions 7-13 and left every candidate answer blank intact.",
    ],
  },
  {
    book: "17",
    page: 86,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-17/page-086-writing-task-1-shop-closures-openings-graph.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The graph below shows the number of shops that closed and the number of
new shops that opened in one country between 2011 and 2018.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.`,
    notes: [
      "Recreated with Image 2; verified the 2011-2018 axis, 0-9,000 scale, two series, legend and all 16 plotted values against the rendered source page.",
    ],
  },
  ...[9, 10, 15, 24, 31, 38, 39, 56, 57, 58, 61, 64, 72, 88, 103, 109, 120, 123, 126, 127, 130].map((page) => ({
    book: "17",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 17 page ${page}: the visual keyword occurs in introductory, passage, ordinary-question, transcript, answer-key or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "18",
    page: 20,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 4-7
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 4-7 on your answer sheet.

Intensive farming versus aeroponic urban farming

| Farming type | Growth | Selection | Sale |
| --- | --- | --- | --- |
| Intensive farming | wide range of 4 __________ used; techniques pollute air | quality not good; varieties of fruit and vegetables chosen that can survive long 5 __________ | 6 __________ receive very little of overall income |
| Aeroponic urban farming | no soil used; nutrients added to water, which is recycled | produce chosen because of its 7 __________ | — |`,
    notes: [
      "Rebuilt the three-column comparison table in code, preserving both farming rows and the Growth, Selection and Sale hierarchy.",
      "Verified Questions 4-7 and left all answer spaces blank.",
    ],
  },
  {
    book: "18",
    page: 31,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-18/page-031-writing-task-1-asian-urban-population-graph.png",
    notes: [
      "Recreated with Image 2; verified all four country series across 1970-2040, the predicted 2030/2040 points, axes and legend.",
    ],
  },
  {
    book: "18",
    page: 35,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 6-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Location | Job title | Responsibilities include | Pay and conditions |
| --- | --- | --- | --- |
| 6 __________ Street | Breakfast supervisor | Checking portions, etc. are correct; making sure 7 __________ is clean | Starting salary 8 £ __________ per hour; start work at 5.30 a.m. |
| City Road | Junior chef | Supporting senior chefs; maintaining stock and organising 9 __________ | Annual salary £23,000; no work on a 10 __________ once a month |`,
    notes: [
      "Rebuilt the employment table in code and preserved all four columns, two job rows, fixed details and Questions 6-10.",
    ],
  },
  {
    book: "18",
    page: 37,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-18/page-037-listening-nunston-housing-map.png",
    text: `Listening
Questions 15-20

Label the map below.
Write the correct letter, A-I, next to Questions 15-20.

Map: proposed housing development

Fixed labels:
- London Road
- West Entrance
- Main Road
- South Entrance
- To Nunston
- Apartment blocks
- Lake
- Housing for the elderly
- Key: housing

Lettered positions:
A north of the lake
B beside housing for the elderly
C near the West Entrance
D south-east of the lake
E at the north-east road end
F beside the western inner road
G beside the central southern housing row
H south-west corner of the development
I at the south-east road end

15 School __________
16 Sports centre __________
17 Clinic __________
18 Community centre __________
19 Supermarket __________
20 Playground __________`,
    notes: [
      "Recreated with Image 2; verified the full road and housing topology, compass, fixed labels, positions A-I and Questions 15-20 against the rendered page.",
    ],
  },
  {
    book: "18",
    page: 54,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-18/page-054-writing-task-1-us-household-income-chart.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The chart below shows the number of households in the US by their annual
income in 2007, 2011 and 2015.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Chart: Number of US households (in millions), by annual income
Unit: millions of households

| Annual income | 2007 | 2011 | 2015 |
| --- | ---: | ---: | ---: |
| Less than $25,000 | 25 | 29 | 28 |
| $25,000-$49,999 | 27 | 30 | 29 |
| $50,000-$74,999 | 21 | 21 | 21 |
| $75,000-$99,999 | 14 | 14 | 15 |
| $100,000 or more | 29 | 28 | 33 |`,
    notes: [
      "Recreated with Image 2; verified the title, axis unit, five income bands and all 15 bar values for 2007, 2011 and 2015.",
    ],
  },
  {
    book: "18",
    page: 57,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 5-10
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Photography competitions

| Title of competition | Instructions | Feedback to Dan |
| --- | --- | --- |
| 5 ‘__________’ | A scene in the home | The picture's composition was not good. |
| ‘Beautiful Sunsets’ | Scene must show some 6 __________ | The 7 __________ was wrong. |
| 8 ‘__________’ | Scene must show 9 __________ | The photograph was too 10 __________. |`,
    notes: [
      "Rebuilt the photography-competitions table in code and preserved all three columns, fixed wording and Questions 5-10.",
    ],
  },
  {
    book: "18",
    page: 77,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-18/page-077-writing-task-1-central-library-plans.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows the floor plan of a public library 20 years ago and
how it looks now.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: Central Library 20 years ago and Central Library today

Central Library 20 years ago:
- Top left: CDs, videos, computer games
- Top right: Children's books
- Middle left: Adult fiction books
- Middle right: Adult non-fiction books
- Centre: Tables and chairs
- Bottom left: Reading room (newspapers and magazines)
- Bottom right: Enquiry desk (tickets, book returns, etc.)
- Entrance at the bottom centre

Central Library today:
- Top left: Children's fiction books, storytelling events, sofas
- Top right: Lecture room
- Middle left: All reference books
- Middle right: Adult fiction books, information desk, self-service machines
- Bottom left: Computer room
- Bottom right: Cafe
- Entrance at the bottom centre`,
    notes: [
      "Recreated with Image 2; verified every room label, wall, doorway, entrance and furnishing in both library plans.",
    ],
  },
  {
    book: "18",
    page: 98,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-18/page-098-writing-task-1-metal-price-change-graph.png",
    notes: [
      "Recreated with Image 2; verified all 12 monthly points for copper, nickel and zinc, the -4 to 7 scale, axes and legend.",
    ],
  },
  {
    book: "18",
    page: 108,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [
      "This is an audioscript page containing answer references for the map task, not a live question page.",
    ],
  },
  ...[2, 7, 8, 11, 27, 51, 53, 86, 95, 97, 107, 112, 119, 120, 129, 132, 134, 137, 145, 146].map((page) => ({
    book: "18",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 18 page ${page}: the visual keyword occurs in introductory, passage, ordinary-question, audioscript, sample-answer or promotional text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "19",
    page: 11,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-19/page-011-listening-farley-house-map.png",
    text: `Test 1
Questions 16-20

Label the map below.
Write the correct letter, A-H, next to Questions 16-20.

Map: Farley House

Fixed labels:
- House
- Old stables
- Car park
- Lake to the west
- Lake to the east

Lettered positions:
A north-east path among trees
B north-west path near the western lake
C north side of the house
D building north-east of the house
E west side of the house
F east path near trees
G north-west corner of the old stables
H south-east corner of the old stables

16 Farm shop __________
17 Disabled entry __________
18 Adventure playground __________
19 Kitchen gardens __________
20 The Temple of the Four Winds __________`,
    notes: [
      "Recreated with Image 2; verified the Farley House topology, fixed labels, paths, lakes, trees, compass, positions A-H and Questions 16-20.",
    ],
  },
  {
    book: "19",
    page: 29,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-19/page-029-writing-task-1-social-centre-activities-graph.png",
    notes: [
      "Recreated with Image 2; verified all five activity series across 2000-2020, the 0-70 scale, axes, legend and 25 plotted values.",
    ],
  },
  {
    book: "19",
    page: 33,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write ONE WORD ONLY for each answer.

A typical 45-minute guitar lesson

| Time | Activity | Notes |
| --- | --- | --- |
| 5 minutes | tuning guitars | using an app or by 7 __________ |
| 10 minutes | strumming chords using our thumbs | keeping time while the teacher is 8 __________ |
| 15 minutes | playing songs | often listening to a 9 __________ of a song |
| 10 minutes | playing single notes and simple tunes | playing together, then 10 __________ |
| 5 minutes | noting things to practise at home | — |`,
    notes: [
      "Rebuilt the 45-minute guitar-lesson table in code and preserved all five time rows, activities, notes and Questions 7-10.",
    ],
  },
  {
    book: "19",
    page: 51,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-19/page-051-writing-task-1-porth-harbour-plans.png",
    notes: [
      "Recreated with Image 2; verified both Porth Harbour plans, boat-area swap, docks, roads, facilities, castle/hotel and public/private beaches.",
    ],
  },
  {
    book: "19",
    page: 55,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write ONE WORD ONLY for each answer.

Shopping

| Place | To buy | Other ideas |
| --- | --- | --- |
| Fish market | a dozen prawns | a handful of 7 __________ (type of seaweed) |
| Organic shop | beans and a 8 __________ for dessert | spices and 9 __________ |
| Bakery | a brown loaf | a 10 __________ tart |`,
    notes: [
      "Rebuilt the Shopping table in code and preserved its three shop rows, To buy/Other ideas columns and Questions 7-10.",
    ],
  },
  {
    book: "19",
    page: 59,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 3
Questions 26-30

Complete the flowchart below.
Choose FIVE answers from the box and write the correct letter, A-H, next to Questions 26-30.

Options:
A size
B escape
C age
D water
E cereal
F calculations
G changes
H colour

Flowchart:
Choose mice which are all the same 26 __________.
Divide the mice into two groups, each with a different 27 __________.
Put each group in a separate cage.
Feed group A commercial mouse food.
Feed group B the same, but also sugar contained in 28 __________.
Take measurements using an electronic scale.
Place them in a weighing chamber to prevent 29 __________.
Do all necessary 30 __________.`,
    notes: [
      "Rebuilt the text-only experimental flowchart in code; verified options A-H, all five ordered boxes and Questions 26-30.",
    ],
  },
  {
    book: "19",
    page: 74,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-19/page-074-writing-task-1-ethanol-biofuel-process.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how a biofuel called ethanol is produced.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: Biofuel production: how ethanol is made

Process labels:
1 Energy from sunlight and carbon dioxide helps plants and trees grow.
2 Plants are harvested.
3 Plant material is pre-processed.
4 Cellulose is extracted.
5 Cellulose is processed into sugars.
6 Microbes are added.
7 Ethanol is produced.
8 Ethanol is used by cars, trucks and aircraft.
9 Carbon dioxide is released and re-enters the cycle.`,
    notes: [
      "Recreated with Image 2; verified every biomass-processing stage, vehicle branch, arrow and the complete carbon-dioxide return cycle.",
    ],
  },
  {
    book: "19",
    page: 77,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write ONE WORD ONLY for each answer.

Responsibilities

| Section | Task 1 | Task 2 | Notes |
| --- | --- | --- | --- |
| Bakery section | Check sell-by dates | Change price labels | Use 7 __________ labels |
| Sushi takeaway counter | Re-stock with 8 __________ boxes if needed | Wipe preparation area and clean the sink | Do not clean any knives |
| Meat and fish counters | Clean the serving area, including the weighing scales | Collect 9 __________ for the fish from the cold-room | Must wear special 10 __________ |`,
    notes: [
      "Rebuilt the Responsibilities table in code and preserved all four columns, three work-area rows and Questions 7-10.",
    ],
  },
  {
    book: "19",
    page: 95,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-19/page-095-writing-task-1-dance-class-charts.png",
    notes: [
      "Recreated with Image 2; verified all four location percentages and all six age-group bar values, axes and legend.",
    ],
  },
  ...[5, 8, 76, 98, 99, 101, 107, 116, 118, 119, 125, 127, 129, 130, 132, 133, 135].map((page) => ({
    book: "19",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 19 page ${page}: the visual keyword occurs in introductory, passage, ordinary-question, audioscript, answer-key or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "20",
    page: 1,
    status: "calibrated",
    reason: "false_positive_text_page",
    text: `Cover page

IELTS Academic 20
Authentic Practice Tests`,
    notes: [
      "This is the front cover, not a test question page.",
    ],
  },
  {
    book: "20",
    page: 28,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The first table below shows changes in the total population of New York City
from 1800 to 2000. The second and third tables show changes in the population
of the five districts of the city (Manhattan, Brooklyn, Bronx, Queens, Staten
Island) over the same period.

New York City (all five districts)

| Year | Population |
| ---: | ---: |
| 1800 | 79,216 |
| 1900 | 3,437,202 |
| 2000 | 8,009,185 |

Manhattan

| Year | Population | As percentage (%) of total population |
| ---: | ---: | ---: |
| 1800 | 60,515 | 76% |
| 1900 | 1,850,093 | 54% |
| 2000 | 1,538,096 | 19% |

Other districts (Brooklyn, Bronx, Queens, Staten Island)

| Year | Population | As percentage (%) of total population |
| ---: | ---: | ---: |
| 1800 | 18,701 | 24% |
| 1900 | 1,587,109 | 46% |
| 2000 | 6,471,089 | 81% |`,
    notes: [
      "Rebuilt all three New York population tables in code and verified every year, population and percentage.",
    ],
  },
  {
    book: "20",
    page: 39,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `PART 1 — Questions 1-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

Local councils can arrange practical support to help those caring for elderly people at home.

This can give the carer:
- time for other responsibilities
- a 1 __________

Assessment of mother's needs

This may include discussion of:
- how much 2 __________ the caring involves
- what types of tasks are involved, e.g.
  - help with dressing
  - helping her have a 3 __________
  - shopping
  - helping with meals
  - dealing with 4 __________
- any aspects of caring that are especially difficult, e.g.
  - loss of 5 __________
  - 6 __________ her
  - preventing a 7 __________`,
    notes: [
      "Rebuilt the hierarchical council-support note/table in code and preserved Questions 1-7 and all nested examples.",
    ],
  },
  {
    book: "20",
    page: 64,
    status: "calibrated",
    reason: "visual_review_adjacent",
    image: "data/generated/image-review/cambridge-ielts-20/page-064-writing-task-1-beechwood-farm-1950.png",
    text: `Test 2
WRITING TASK 1
You should spend about 20 minutes on this task.

The plans below show the site of a farm in 1950 and the same site today.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Plan: Beechwood Farm in 1950
- Road along the north-west side
- River along the south-west and south-east edge
- Track from the road through the centre to the farm buildings
- Fruit trees and soft fruits west of the track
- Vegetables south of the soft fruits
- Sheep field north-east of the track
- Barn east of the track
- Farmhouse south-east of the barn
- Chickens south of the farmhouse`,
    notes: [
      "Recreated with Image 2; verified every 1950 field, track, building, road and river relationship.",
      "This page pairs with page 65, which contains the Today plan at the same site scale.",
    ],
  },
  {
    book: "20",
    page: 65,
    status: "calibrated",
    reason: "visual_review_adjacent",
    image: "data/generated/image-review/cambridge-ielts-20/page-065-writing-task-1-beechwood-farm-today.png",
    text: `Plan: Beechwood Farm today
- Road along the north-west side and a new road network through the site
- River remains along the south-west and south-east edge
- Fruit trees remain to the west
- Farm shop and parking added near the north-west road
- Soft fruits and vegetables remain in the south-west/central fields
- Camping field added in the north-east
- Solar panels added in the far north-east
- Holiday cottages, parking and farmhouse in the east
- Barn remains near the centre-east
- Chickens remain south-east of the barn`,
    notes: [
      "Recreated with Image 2; verified every retained field and all added roads, parking, farm shop, camping field, solar panels and holiday cottages.",
    ],
  },
  {
    book: "20",
    page: 77,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `PART 1 — Questions 1-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

Furniture Rental Companies

| Name of company | Information about costs | Additional notes |
| --- | --- | --- |
| Peak Rentals | Prices range from $105 to $ 1 __________ per room per month | The furniture is very 2 __________; delivers in 1-2 days; special offer: free 3 __________ with every living room set |
| 4 __________ and Oliver | Mid-range prices; 12% monthly fee for 5 __________ | Also offers a cleaning service |
| Larch Furniture | Offers cheapest prices for renting furniture and 6 __________ items | Must have own 7 __________; minimum contract length: six months |
| 8 __________ Rentals | See the 9 __________ for the most up-to-date prices | 10 __________ are allowed within 7 days of delivery |`,
    notes: [
      "Rebuilt the Furniture Rental Companies table in code and preserved all three columns, four company rows and Questions 1-10.",
    ],
  },
  {
    book: "20",
    page: 80,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-20/page-080-listening-bidcaster-archaeological-dig-map.png",
    text: `Test 3
Questions 17-20

Label the map below.
Drag the correct letter, A-G, next to Questions 17-20.

Map: Bidcaster Archaeological Dig

Fixed labels:
- River
- Castle walls
- Site of current dig
- You are here
- Information boards

Lettered positions:
A west side near castle walls
B north side by the river
C north-east position by the path
D central position near the site of current dig
E east woodland area
F south-west position near castle walls
G south-west of the site of current dig

17 __________
18 __________
19 __________
20 __________`,
    notes: [
      "Recreated with Image 2; verified the river, castle walls, paths, dig area, trees, information boards, compass, positions A-G and location marker.",
    ],
  },
  {
    book: "20",
    page: 103,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-20/page-103-writing-task-1-little-chalfont-library-charts.png",
    notes: [
      "Recreated with Image 2; verified four member-age percentages, all seven loan-category percentages and ten annual loan bars for 2007-2016.",
    ],
  },
  {
    book: "20",
    page: 138,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-20/page-138-writing-task-1-bamboo-fabric-process.png",
    text: `Test 4
WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how fabric is manufactured from bamboo.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: How bamboo fabric is made

Process labels:
1 Plant bamboo plants in spring.
2 Harvest in autumn.
3 Cut into strips.
4 Crush strips to make liquid pulp.
5 Filter to separate long fibres from liquid.
6 Soften fibres by adding water and amine oxide.
7 Spin to make yarn.
8 Weave to make fabric.
9 Produce clothing and other fabric products.`,
    notes: [
      "Recreated with Image 2; verified all nine stage numbers, seasonal labels, chemical treatment, arrows, yarn, fabric and final garments.",
    ],
  },
  {
    book: "20",
    page: 183,
    status: "calibrated",
    reason: "false_positive_text_page",
    text: `Back cover page

IELTS Academic 20 practice-test back cover and publisher information.`,
    notes: [
      "This is the back cover, not a test question page.",
    ],
  },
  ...[8, 13, 14, 15, 29, 67, 68, 71, 73, 74, 79, 104, 105, 122, 139, 149, 156, 161, 162, 163, 165, 166, 167, 176].map((page) => ({
    book: "20",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 20 page ${page}: the visual keyword occurs in passage, speaking prompt, ordinary question, audioscript, answer-key or sample-answer text; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "21",
    page: 11,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 1
Questions 1-6

Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

Oyster Bay Sailing Club Courses

| Name of course | What you learn | Cost | Other information |
| --- | --- | --- | --- |
| Taster day | introduction to sailing | £120 if booking one place | small groups (max 1 __________ people) |
| Level 1 | basic theory, e.g. understanding the 2 __________ and tides; basic sailing skills including 3 __________ information | £200; 4 __________ available for club members; all inclusive (plus a useful 5 __________) | a 6 __________ at the end of the course for all participants |

Questions 7-10

Complete the notes below.
Write ONE WORD ONLY for each answer.

General information
- Participants must be able to swim.
- Bring suitable clothing, a 7 __________ and toiletries (e.g. shampoo).
- There is a 8 __________ at the club.
- Online training 9 __________ are recommended.
- 10 __________ are available for course participants.`,
    notes: [
      "Rebuilt as Markdown from the original page; course rows, costs, numbered blanks and general-information bullets were checked manually.",
    ],
  },
  {
    book: "21",
    page: 30,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-21/page-030-writing-task-1-us-sector-jobs-graph.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The graph below shows the number of jobs in four sectors of the US economy
between 1960 and 2020.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Graph: Number of jobs in four sectors of the economy in the US, 1960-2020

Values (millions of jobs):
| Sector | 1960 | 1980 | 2000 | 2020 |
| --- | ---: | ---: | ---: | ---: |
| Manufacturing | 15 | 20 | 17 | 13 |
| Retail | 6 | 10 | 15 | 16 |
| Agriculture | 6 | 3 | 3 | 2 |
| Healthcare | 2 | 5 | 11 | 16 |`,
    notes: [
      "Recreated with Image 2; title, axes, four series, markers and all plotted values were manually verified.",
    ],
  },
  {
    book: "21",
    page: 33,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 2
Questions 1-10

Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

One-day classes at Steynford College

| Course | Date | Cost | Notes |
| --- | --- | --- | --- |
| Vietnamese food | 1 __________ | £59 | It provides information on the use of herbs. There are no places at present. |
| Bread making | 20 March | 2 £ __________ | There is also an extra charge for ingredients. Participants make white bread, sourdough and 3 __________. |
| Face massage | 23 February | £35 | The teacher trained in 4 __________. Bring a 5 __________. |
| Candle making | 6 __________ | £52 | Only 7 __________ ingredients are used. The candles can be used as presents. |
| Silk painting | 18 May | 8 £ __________ | Bring an apron or old 9 __________. |
| DIY for beginners | 24 February | £125 | Learn how to use a drill, saw and 10 __________; put up a shelf. |`,
    notes: [
      "Rebuilt as Markdown from the original page; all six courses, fixed dates and costs, notes and blanks 1-10 were checked manually.",
    ],
  },
  {
    book: "21",
    page: 35,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-21/page-035-listening-melby-coal-mine-map.png",
    text: `Test 2
Questions 15-20

Label the map below.
Write the correct letter, A-I, next to Questions 15-20.

Map: Melby Coal Mine

Fixed labels:
- Engine house
- Main visitor centre
- Ticket office
- Car park
- Covered walkway

Lettered positions:
A south-west building
B north-west building
C building east of the engine house
D north-central building
E central building linked by covered walkway
F west side of main visitor centre
G main visitor centre room next to the ticket office
H north-east large building
I south-east building north of the car park

15 Exhibition __________
16 Baths __________
17 Tools __________
18 Vehicles __________
19 Ponies __________
20 Education centre __________`,
    notes: [
      "Recreated with Image 2; compass, fixed labels, A-I positions and covered-walkway topology were manually verified.",
    ],
  },
  {
    book: "21",
    page: 37,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 2
Questions 27-30

Complete the flow-chart below.
Choose FOUR answers from the box and write the correct letter, A-F, next to Questions 27-30.

Options:
A This was challenging but enjoyable.
B This led to some disagreement.
C This was easy to decide on.
D This was helped by the guidelines provided.
E This seemed like an unnecessary stage.
F This involved selecting a new ingredient.

Student project: developing a new food product

Initial aim: 27 __________
↓
Literature review: 28 __________
↓
Product development: 29 __________
↓
Product production: 30 __________`,
    notes: [
      "Rebuilt as a text flowchart; options A-F, stage order and blanks 27-30 were checked manually, so no scan image is required.",
    ],
  },
  {
    book: "21",
    page: 41,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 2
Questions 1-5

Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-5 on your answer sheet.

Research into sleep and dreaming

| Subject | Research findings | Comment |
| --- | --- | --- |
| Humans | humans experience REM sleep and non-REM sleep; in REM sleep, the eyes and muscles move | |
| 1 __________ | similar brain patterns were observed when active and sleeping | indicative of dreaming |
| Pigeons | when sleeping, pigeons displayed activity in parts of the brain that deal with 2 __________ input | may have been dreaming of flying |
| Whales and dolphins | still have 3 __________ their brain awake when they sleep; do not experience REM sleep, as this could affect their sensitivity to 4 __________ | their dreams are probably not very 5 __________ |`,
    notes: [
      "Rebuilt as Markdown from the original page; human, pigeon, whale and dolphin findings, comments and blanks 1-5 were checked manually.",
    ],
  },
  {
    book: "21",
    page: 52,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-21/page-052-writing-task-1-college-cafe-plans.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The plans below show a college cafe before and after it was redesigned.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Plans: Cafe before redesign and Cafe today

Before redesign: Kitchen; Serving area (all food & drink); Staff dining rooms;
Tables and chairs; Bin; Toilets.

Today: Kitchen; Hot meals; Take away food; Coffee bar; Salad bar; Barbecue;
Tables and chairs; Recycling bins; Toilets; Outdoor seating.`,
    notes: [
      "Recreated with Image 2; both plans, wall topology, doors, service areas, dining rooms, bins, toilets and five outdoor table groups were manually verified.",
    ],
  },
  {
    book: "21",
    page: 73,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-21/page-073-writing-task-1-rain-shadow-desert.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The diagram below shows how one type of desert, known as a rain-shadow desert,
is formed.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Diagram: The formation of rain-shadow deserts

Process labels:
1 Winds approach coast.
2 Winds are pushed upwards.
3 Moist air rises and cools.
4 Clouds form.
5 Rain falls on the windward side.
6 Dry air continues over the mountain to the leeward side.
7 Dry winds reach inland areas, forming a rain-shadow desert.

Fixed labels:
- Sea
- Coast
- Mountains
- Windward side
- Leeward side
- Inland
- Rain-shadow desert
- Thousands of kilometres`,
    notes: [
      "Recreated with Image 2; all seven numbered stages, geographic labels, air-flow arrows, clouds, rain and distance scale were manually verified.",
    ],
  },
  {
    book: "21",
    page: 85,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 4
Questions 8-10

Complete the flow-chart below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 8-10 on your answer sheet.

Generating biogas for domestic use in Dunga

First, place water hyacinth together with some 8 __________ into a digester.
↓
Leave the mixture until the 9 __________ is completed.
↓
Capture the gas emitted by the digester and use 10 __________ to transport it to individual homes.
↓
Then use the gas for cooking as well as making water fit for human consumption.

Questions 11-13

Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 11-13 on your answer sheet.

Cooking with biogas in Dunga

Benefits for the women in the village of cooking with biogas:
- no need for them to spend so much 11 __________ collecting fuel
- they can focus on different tasks that bring in 12 __________
- they are less likely to experience certain diseases connected to burning wood

Drawbacks of changing to biogas:
- the 13 __________ of the digesters is beyond the reach of most villages`,
    notes: [
      "Rebuilt as a text flowchart plus notes; stage order, blanks 8-10, headings, bullets and blanks 11-13 were checked manually, so no scan image is required.",
    ],
  },
  {
    book: "21",
    page: 95,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-21/page-095-writing-task-1-library-user-categories-pie.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The chart and table below show the results of a survey of library users at a university.

Summarise the information by selecting and reporting the main features, and
make comparisons where relevant.

Write at least 150 words.

Categories of library users:
- Full-time undergraduate: 44%
- Full-time postgraduate: 25%
- Part-time postgraduate: 16%
- Distance learning (all courses): 8%
- Academic staff: 7%

Library user satisfaction (%)

| Feature | Very satisfied | Fairly satisfied | Not satisfied |
| --- | ---: | ---: | ---: |
| Library opening hours | 65 | 35 | 0 |
| Helpfulness of staff | 95 | 5 | 0 |
| Availability of books | 50 | 40 | 10 |
| Availability of journals | 45 | 35 | 20 |
| Reliability of wi-fi | 48 | 33 | 19 |`,
    notes: [
      "Pie chart recreated with Image 2; all five categories and percentages were verified. The satisfaction table was rebuilt as Markdown and checked cell by cell.",
    ],
  },
  ...[6, 7, 10, 27, 44, 46, 67, 90, 91, 92, 101, 104, 108, 116, 117, 126, 130, 133, 137, 138].map((page) => ({
    book: "21",
    page,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 21 page ${page}: the visual keyword occurs in ordinary instructions, passage text, speaking prompts, answer keys or sample answers; no missing candidate-facing image or structured table is present.`],
  })),
  {
    book: "04",
    page: 2,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 5-10
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

WEEKEND TRIPS

| Place | Date | Number of seats | Optional extra |
| --- | --- | --- | --- |
| St Ives | 5 __________ | 16 | Hepworth Museum |
| London | 16th February | 45 | 6 __________ |
| 7 __________ | 3rd March | 18 | S.S. Great Britain |
| Salisbury | 18th March | 50 | Stonehenge |
| Bath | 23rd March | 16 | 8 __________ |

For further information:
Read the 9 __________ or see Social Assistant: Jane 10 __________`,
    notes: [
      "Questions 5-10 table rows and further-information line verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 39,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `students discuss?

A The data is sometimes invalid.
B Too few people may respond.
C It is less likely to reveal the unexpected.
D It can only be used with literate populations.
E There is a delay between the distribution and return of questionnaires.

Questions 27-30
Complete the table below.
Write NO MORE THAN THREE WORDS OR A NUMBER for each answer.

| Author | Title | Publisher | Year of publication |
| --- | --- | --- | --- |
| 27 __________ | 'Sample Surveys in Social Science Research' |  |  |
| Bell | 28 __________ | 29 __________ |  |
| Wilson | 'Interviews that work' | Oxford University Press | 30 __________ |`,
    notes: [
      "Multiple-choice tail and Questions 27-30 bibliographic table verified against the rendered page.",
      "The source table layout is irregular; this preserves the visible blanks and fixed text without collapsing columns.",
    ],
  },
  {
    book: "04",
    page: 71,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 4 Questions 31-40

Questions 31 and 32
Complete the notes below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

New Union Building

Procedures to establish student opinion:
- students were asked to give written suggestions on the building's design
- these points informed the design of a 31 __________
  (there were 32 __________ respondents)
- results collated and report produced by Union Committee

Questions 33-37
Complete the table below.
Write NO MORE THAN THREE WORDS for each answer.`,
    notes: [
      "Questions 31-32 notes and the Questions 33-37 table instructions verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 72,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `CHOICE OF SITE

|  | Site One | Site Two | Site Three |
| --- | --- | --- | --- |
| Location | City centre near Faculty of 33 __________ | Outskirts near park | Out of town near the 34 __________ |
| Advantages and/or disadvantages | Problems with 35 __________ and __________ | Close to 36 __________ | Access to living quarters. Larger site, so more 37 __________ |

Question 38
Choose TWO letters A-G.
Which TWO facilities did the students request in the new Union building?

A a library
B a games room
C a student health centre
D a mini fitness centre
E a large swimming pool
F a travel agency
G a lecture theatre`,
    notes: [
      "Choice of Site table and Questions 38 A-G options verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 79,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `A unemployment
B war
C poverty
D crime

4 In order to become more independent, street children may

A reject paid employment.
B leave their families.
C set up their own businesses.
D employ other children.

Questions 5-8
Complete the table below.
Choose NO MORE THAN THREE WORDS from Reading Passage 1 for each answer.
Write your answer in boxes 5-8 on your answer sheet.`,
    notes: [
      "Question 4 options and Questions 5-8 table instructions verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 80,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `| Country | Organizations involved | Type of project | Support provided |
| --- | --- | --- | --- |
| 5 __________ and __________ | S.K.I. | courier service | provision of 6 __________ |
| Dominican Republic | S.K.I.; Y.W.C.A. | 7 __________ | loans; storage facilities; savings plans |
| Zambia | S.K.I.; The Red Cross; Y.W.C.A. | setting up small businesses | business training; 8 __________ training; access to credit |

Questions 9-12
Do the following statements agree with the claims of the writer in Reading Passage 1?
In boxes 9-12 on your answer sheet write

YES if the statement agrees with the claims of the writer
NO if the statement contradicts the claims of the writer
NOT GIVEN if it is impossible to say what the writer thinks about this

9 Any street child can set up their own small business if given enough support.
10 In some cases, the families of street children may need financial support from S.K.I.`,
    notes: [
      "Questions 5-8 table continuation and the start of Questions 9-12 verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 92,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 32-36
Complete the table below.
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 32-36 on your answer sheet.

| Methods of obtaining linguistic data | Advantages | Disadvantages |
| --- | --- | --- |
| 32 __________ as informant | convenient | method of enquiry not objective enough |
| non-linguist as informant | necessary with 33 __________ and child speech | the number of factors to be considered |
| recording an informant | allows linguists' claims to be checked | 34 __________ of sound |
| videoing an informant | allows speakers' 35 __________ to be observed | 36 __________ might miss certain things |`,
    notes: [
      "Questions 32-36 linguistic-data table verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 101,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `C every night.

Questions 16-20
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

| Length of holiday | Cost per person (including all accommodation costs) | Special offers included in price |
| --- | --- | --- |
| 3 days | 16 $ __________ | Pick up from the 17 __________ |
| 7 days | $350 | As above plus book of 18 __________; maps |
| 14 days | 19 $ __________ | As above plus membership of a 20 __________ |`,
    notes: [
      "Question 15 tail and Questions 16-20 holiday-cost table verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 102,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3 Questions 21-30

Questions 21-26
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

| Experiment number | Equipment | Purpose |
| --- | --- | --- |
| Experiment 1 | 21 __________ and a table | To show how things move on a cushion of air |
| Experiment 2 | Lots of paperclips | To show why we need standard 22 __________ |
| Experiment 3 | 23 __________ and a jar of water | To show how 24 __________ grow |
| Experiment 4 | Cardboard, colored pens and a 25 __________ | To teach children about how 26 __________ is made up |
| Experiment 5 | A drill, an old record, a pin/needle, paper, a bolt | To make a record player in order to learn about recording sound |`,
    notes: [
      "Questions 21-26 experiment table verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 103,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `Questions 27-30
What problems do the speakers identify for each experiment?
Choose your answers from the box and write the letters A-H next to questions 27-30.

Problems

A too messy
B too boring
C too difficult
D too much equipment
E too long
F too easy
G too noisy
H too dangerous

Experiment 1: 27 __________
Experiment 2: 28 __________
Experiment 3: 29 __________
Experiment 4: Example F
Experiment 5: 30 __________`,
    notes: [
      "Questions 27-30 problem-choice list and experiment blanks verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 13,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 1
SECTION 2 Questions 11-20

Questions 11-19
Complete the table below.
Write NO MORE THAN THREE WORDS for each answer.

| Brand of cot | Good points | Problems | Verdict |
| --- | --- | --- | --- |
| Baby Safe | Easy to 11 __________ | Did not have any 12 __________; Babies could trap their 13 __________ in the side bar | 14 __________ |
| Choice Cots | Easy to 15 __________ | Side did not drop down; Spaces between the bars were 16 __________ | 17 __________ |
| Mother's Choice | Base of cot could be moved | Did not have any 18 __________; Pictures could be removed easily | 19 __________ |

Question 20
Complete the notes below.
Write ONE WORD ONLY for the answer.

- Metal should not be rusted or bent
- Edges of cot should not be 20 __________`,
    notes: [
      "Questions 11-19 cot comparison table and Question 20 notes verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 36,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3 Questions 21-30

Questions 21-30
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

'Student Life' video project

|  | Cristina | Ibrahim |
| --- | --- | --- |
| Enjoyed | using the camera; going to a British 21 __________ | contact with students doing other courses (has asked some to 22 __________ with him) |
| Most useful language practice | listening to instructions; learning 23 __________ vocabulary | listening to British students' language because of: normal speed; large amount of 24 __________ |
| General usefulness | operating video camera; working with other people: learning about 25 __________; compromising; 26 __________ people who have different views | the importance of 27 __________ |
| Things to do differently in future | decide when to 28 __________ each stage at the beginning; make more effort to 29 __________ with the camera | don't make the film too 30 __________ |`,
    notes: [
      "Student Life video project table for Questions 21-30 verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 62,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 36-40
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Companies working with recycled materials

| Material | Company | Product that the company manufactures |
| --- | --- | --- |
| glass | CLF Aggregates | material used for making 36 __________ |
| paper | Martin's | office stationery |
| paper | Papersave | 37 __________ for use on farms |
| plastic | Pacrite | 38 __________ for collecting waste |
| plastic | Waterford | 39 __________ |
| plastic | Johnson & Jones | 40 __________ |`,
    notes: [
      "Questions 36-40 recycled-materials table verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 80,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 2 Questions 11-20

Questions 11-13
Complete the sentences below.
Write NO MORE THAN TWO WORDS for each answer.

11 The next meeting of the soccer club will be in the __________ in King's Park on 2 July.
12 The first event is a __________.
13 At the final dinner, players receive __________.

Questions 14-17
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

| Competition | Number of teams | Games begin | Training session (in King's Park) |
| --- | --- | --- | --- |
| Junior | 14 __________ | 8.30 am | 15 __________ |
| Senior | 16 __________ | 2.00 pm | 17 __________ |`,
    notes: [
      "Questions 11-13 sentences and Questions 14-17 competition table verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 81,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 18-20
Complete the table below.
Write NO MORE THAN THREE WORDS for each answer.

| Name of office bearer | Responsibility |
| --- | --- |
| Robert Young: President | to manage meetings |
| Gina Costello: Treasurer | to 18 __________ |
| David West: Secretary | to 19 __________ |
| Jason Dokic: Head Coach | to 20 __________ |`,
    notes: [
      "Questions 18-20 office-bearer table verified against the rendered page.",
    ],
  },
  {
    book: "05",
    page: 89,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 4

Questions 4-9
Do the following statements reflect the opinion of the writer of Reading Passage 1?
In boxes 4-9 on your answer sheet, write

YES if the statement reflects the opinion of the writer
NO if the statement contradicts the opinion of the writer
NOT GIVEN if it is impossible to say what the writer thinks about this

4 The low financial cost of setting up wilderness tourism makes it attractive to many countries.
5 Deserts, mountains and Arctic regions are examples of environments that are both ecologically and culturally fragile.
6 Wilderness tourism operates throughout the year in fragile areas.
7 The spread of tourism in certain hill-regions has resulted in a fall in the amount of food produced locally.
8 Traditional food-gathering in desert societies was distributed evenly over the year.
9 Government handouts do more damage than tourism does to traditional patterns of food-gathering.

Questions 10-13
Complete the table below.
Choose ONE WORD from Reading Passage 1 for each answer.
Write your answers in boxes 10-13 on your answer sheet.

The positive ways in which some local communities have responded to tourism

| People/Location | Activity |
| --- | --- |
| Swiss Pays d'Enhaut | Revived production of 10 __________ |
| Arctic communities | Operate 11 __________ businesses |
| Acoma and San Ildefonso | Produce and sell 12 __________ |
| Navajo and Hopi | Produce and sell 13 __________ |`,
    notes: [
      "Questions 4-9 statements and Questions 10-13 tourism-response table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 12,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 5-8
Complete the table below.
Write NO MORE THAN TWO NUMBERS for each answer.

MEMBERSHIP SCHEMES

| Type | Use of facilities | Cost of classes | Times | Joining fee | Annual subscription |
| --- | --- | --- | --- | --- | --- |
| GOLD | All | Free | Any time | GBP250 | 5 GBP __________ |
| SILVER | All | 6 GBP __________ | from 7 __________ to __________ | GBP225 | GBP300 |
| BRONZE | Restricted | GBP3 | from 10.30 to 3.30 weekdays only | GBP50 | 8 GBP __________ |

Questions 9 and 10
Complete the sentences below.
Write ONE WORD ONLY for each answer.

9 To join the centre, you need to book an instructor's __________.
10 To book a trial session, speak to David __________ (0458 95311).`,
    notes: [
      "Questions 5-8 membership-schemes table and Questions 9-10 sentences verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 14,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 17-20
Complete the table below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

| Play | Dates | Starting time | Tickets available | Price |
| --- | --- | --- | --- | --- |
| Royal Hunt of the Sun | October 13th to 17 __________ | 18 __________ pm | for 19 __________ and __________ | 20 GBP __________ |`,
    notes: [
      "Questions 17-20 play ticket table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 15,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3 Questions 21-30

Question 21
Choose the correct letter, A, B or C.

21 What is Brian going to do before the course starts?

A attend a class
B write a report
C read a book

Questions 22-25
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

| College facility | Information |
| --- | --- |
| Refectory | inform them 22 __________ about special dietary requirements |
| 23 __________ | long waiting list, apply now |
| Careers advice | drop-in centre for information |
| Fitness centre | reduced 24 __________ for students |
| Library | includes books, journals, equipment room containing audio-visual materials |
| Computers | ask your 25 __________ to arrange a password with the technical support team |`,
    notes: [
      "Question 21 options and Questions 22-25 college-facility table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 17,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 4 Questions 31-40

Questions 31-37
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Social history of the East End of London

| Period | Situation |
| --- | --- |
| 1st-4th centuries | Produce from the area was used to 31 __________ the people of London. |
| 5th-10th centuries | New technology allowed the production of goods made of 32 __________ and __________. |
| 11th century | Lack of 33 __________ in the East End encouraged the growth of businesses. |
| 16th century | Construction of facilities for the building of 34 __________ stimulated international trade. Agricultural workers came from other parts of 35 __________ to look for work. |
| 17th century | Marshes were drained to provide land that could be 36 __________ on. |
| 19th century | Inhabitants lived in conditions of great 37 __________, with very poor sanitation. |`,
    notes: [
      "Questions 31-37 East End history table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 18,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `Questions 38-40
Choose THREE letters, A-G.

Which THREE of the following problems are mentioned in connection with 20th century housing in the East End?

A unsympathetic landlords
B unclean water
C heating problems
D high rents
E overcrowding
F poor standards of building
G houses catching fire`,
    notes: [
      "Questions 38-40 A-G option list verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 35,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 2

Questions 6-10
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

Next two workshops

| Date | Workshop title | Content of workshop | Tutor |
| --- | --- | --- | --- |
| 16/11 | Building 6 __________ | 7 __________ | 8 __________ |
| 23/11 | 9 __________ | Nothing special | 10 __________ |`,
    notes: [
      "Questions 6-10 next-two-workshops table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 36,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 2 Questions 11-20

Questions 11-14
Complete the sentences below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

TRAIN INFORMATION

11 Local services depart from __________ railway station.
12 National services depart from the __________ railway station.
13 Trains for London depart every __________ each day during the week.
14 The price of a first class ticket includes __________.

Questions 15-17
Complete the table below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

| Type of ticket | Details |
| --- | --- |
| Standard open | no restrictions |
| Supersave | travel after 8.45 |
| Special | travel after 15 __________ and at weekends |
| 16 __________ | buy at least six days ahead; limited numbers; 17 __________ essential |`,
    notes: [
      "Questions 11-14 train-information sentences and Questions 15-17 ticket table verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 37,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `Questions 18-20
Choose THREE letters, A-G.

Which THREE attractions can you visit at present by train from Trebirch?

A a science museum
B a theme park
C a climbing wall
D a mining museum
E an aquarium
F a castle
G a zoo`,
    notes: [
      "Questions 18-20 A-G option list verified against the rendered page.",
    ],
  },
  {
    book: "06",
    page: 81,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Test 4

Questions 14-20
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

Travel Expo
Temporary Staff Orientation Programme

| Time | Event | Details |
| --- | --- | --- |
| 9.30 am | Talk by Anne Smith | information about pay; will give out the 14 __________ forms |
| 10.00 am | Talk by Peter Chen | will discuss Conference Centre plan; will explain about arrangements for 15 __________ and fire exits |
| 10.30 am | Coffee Break | go to Staff Canteen on the 16 __________ |
| 11.00 am | Video Presentation | go to 17 __________; video title: 18 __________ |
| 12.00 | Buffet Lunch | go to the 19 __________ on 1st floor |
| 1.00 pm | Meet the 20 __________ |  |
| 3.00 pm | Finish |  |`,
    notes: [
      "Questions 14-20 Travel Expo orientation table verified against the rendered page.",
    ],
  },
  {
    book: "04",
    page: 10,
    status: "calibrated",
    reason: "text_structure_repair",
    text: `Secondary school children were asked to complete a questionnaire containing five
open-form questions. The most frequent responses to the first question were
descriptions which are self-evident from the term 'rainforest'. Some children
described them as damp, wet or hot. The second question concerned the geographical
location of rainforests. The commonest responses were continents or countries: Africa
(given by 43% of children), South America (30%), Brazil (25%). Some children also
gave more general locations, such as being near the Equator.

Responses to question three concerned the importance of rainforests. The dominant
idea, raised by 64% of the pupils, was that rainforests provide animals with habitats.
Fewer students responded that rainforests provide plant habitats, and even fewer
mentioned the indigenous populations of rainforests. More girls (70%) than boys
(60%) raised the idea of rainforest as animal habitats.

Similarly, but at a lower level, more girls (13%) than boys (5%) said that
rainforests provided human habitats. These observations are generally consistent with
our previous studies of pupils' views about the use and conservation of rainforests, in
which girls were shown to be more sympathetic to animals and expressed views
which seem to place an intrinsic value on non-human animal life.

The fourth question concerned the causes of the destruction of rainforests. Perhaps
encouragingly, more than half of the pupils (59%) identified that it is human activities
which are destroying rainforests, some personalising the responsibility by the use of
terms such as 'we are'. About 18% of the pupils referred specifically to logging
activity.

One misconception, expressed by some 10% of the pupils, was that acid rain is
responsible for rainforest destruction; a similar proportion said that pollution is
destroying rainforests. Here, children are confusing rainforest destruction with
damage to the forests of Western Europe by these factors. While two fifths of the
students provided the information that the rainforests provide oxygen, in some cases
this response also embraced the misconception that rainforest destruction would
reduce atmospheric oxygen, making the atmosphere incompatible with human life on
Earth.`,
    notes: [
      "Corrected a damaged local source page that had collapsed two sentences into '(60%)' and read '1) %' instead of '10%'.",
      "Wording cross-checked against the official Cambridge IELTS 4 sample worksheet.",
    ],
  },
  {
    book: "04",
    page: 20,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-04/page-020-fig-1.png"],
    image: "data/generated/image-review/cambridge-ielts-04/page-020-reading-spinning-wheel-figure.png",
    notes: [
      "Inserted the missing Fig. 1 spinning-wheel illustration referenced by Reading Passage 3.",
      "The crop keeps the visual symbol without duplicating the full source page in the CBT passage.",
    ],
  },
  {
    book: "04",
    page: 23,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `'near' to circle. In fact, only a small majority of sighted subjects - 53% - had paired
far and near to the opposite partners. Thus, we concluded that the blind interpret
abstract shapes as sighted people do.

| Words associated with circle/square | Agreement among subjects (%) |
| --- | ---: |
| SOFT-HARD | 100 |
| MOTHER-FATHER | 94 |
| HAPPY-SAD | 94 |
| GOOD-EVIL | 89 |
| LOVE-HATE | 89 |
| ALIVE-DEAD | 87 |
| BRIGHT-DARK | 87 |
| LIGHT-HEAVY | 85 |
| WARM-COLD | 81 |
| SUMMER-WINTER | 81 |
| WEAK-STRONG | 79 |
| FAST-SLOW | 79 |
| CAT-DOG | 74 |
| SPRING-FALL | 74 |
| QUIET-LOUD | 62 |
| WALKING-STANDING | 62 |
| ODD-EVEN | 57 |
| FAR-NEAR | 53 |
| PLANT-ANIMAL | 53 |
| DEEP-SHALLOW | 51 |

Fig. 2 Subjects were asked which word in each pair fits best with a circle and
which with a square. These percentages show the level of consensus among
sighted subjects.`,
    notes: [
      "Restored the missing Fig. 2 percentage table; the OCR source retained only its caption.",
      "All twenty word pairs and percentages were checked against the rendered page and the official Cambridge sample worksheet.",
    ],
  },
  {
    book: "04",
    page: 25,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-04/page-025-questions-30-32.png"],
    image: "data/generated/image-review/cambridge-ielts-04/page-025-reading-wheel-movement-diagrams.png",
    notes: [
      "Inserted the three wheel diagrams required to answer Questions 30-32.",
      "The crop includes the A-E movement key so the question remains self-contained.",
    ],
  },
  {
    book: "04",
    page: 53,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-04/page-053-questions-24-26.png"],
    image: "data/generated/image-review/cambridge-ielts-04/page-053-reading-medical-complaints-bar-chart.png",
    notes: [
      "Inserted the horizontal bar chart required to answer Questions 24-26.",
      "The crop preserves the title, every printed vertical-axis label (including Candida), all three numbered blanks, and the complete 0%-30% scale.",
    ],
  },
  {
    book: "04",
    page: 125,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-04/page-125-writing-task-1-charts.png"],
    image: "data/generated/image-review/cambridge-ielts-04/page-125-writing-task-1-uk-travel-charts.png",
    notes: [
      "Restored both charts required by Writing Test 1 Task 1: visits to and from the UK, and the five most popular countries visited by UK residents in 1999.",
      "The second chart continues on PDF page 126; both charts are combined into one prompt asset so the generated Task 1 remains self-contained.",
    ],
  },
  {
    book: "05",
    page: 6,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is the module introduction listing possible question types, not a question page with a missing visual."],
  },
  {
    book: "05",
    page: 25,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: 'shows a different picture' is prose in Reading Passage 3, not a reference to a missing figure."],
  },
  {
    book: "05",
    page: 30,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-05/page-030-writing-task-1-graph.png"],
    image: "data/generated/image-review/cambridge-ielts-05/page-030-writing-task-1-ageing-population-line-graph.png",
    notes: ["Restored the Writing Test 1 Task 1 line graph, including the Japan, Sweden and USA legend and the complete 1940-2040 axes."],
  },
  {
    book: "05",
    page: 42,
    status: "calibrated",
    reason: "structured_flowchart_repair",
    text: `Questions 4–8
Complete the flow-chart.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 4–8 on your answer sheet.

## The Production of Bakelite

**phenol** + **formaldehyde**
→ combine under vacuum
→ stage one resin, called **4 __________**
→ cool until hardened
→ break up and grind into powder

Add all of the following:

- **5 __________** (e.g. cotton, asbestos)
- catalysts
- **6 __________** (produced from ammonia + formaldehyde)

→ stage two resin
→ cool until hardened
→ break up and grind into powder
→ **7 __________ Bakelite**
→ heat
→ pour into mould
→ apply intense heat and **8 __________**
→ cool until hardened`,
    notes: ["Converted the original branching Bakelite flow chart into a clean Markdown arrow sequence while preserving both side inputs and blanks 4-8."],
  },
  {
    book: "05",
    page: 52,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 38-40
Complete the table.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.

Science written in the first half of the 17th century

| Language used | Latin | English |
| --- | --- | --- |
| Type of science | Original | 38 __________ |
| Examples | 39 __________ | Encyclopaedias |
| Target audience | International scholars | 40 __________, but socially wider |`,
    notes: ["Reconstructed the original three-column table and restored blank 39, which was lost entirely by OCR reading order."],
  },
  {
    book: "05",
    page: 53,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-05/page-053-writing-task-1-charts.png"],
    image: "data/generated/image-review/cambridge-ielts-05/page-053-writing-task-1-study-reasons-employer-support-charts.png",
    notes: ["Restored both Writing Test 2 Task 1 bar charts with their legends, age groups and percentage axes."],
  },
  {
    book: "05",
    page: 99,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.
The table below gives information about the underground railway systems in six cities.
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
Write at least 150 words.

Underground Railway Systems

| City | Date opened | Kilometres of route | Passengers per year (millions) |
| --- | ---: | ---: | ---: |
| London | 1863 | 394 | 775 |
| Paris | 1900 | 199 | 1191 |
| Tokyo | 1927 | 155 | 1927 |
| Washington DC | 1976 | 126 | 144 |
| Kyoto | 1981 | 11 | 45 |
| Los Angeles | 2001 | 28 | 50 |`,
    notes: ["Converted the OCR row stream into the original four-column Writing Task 1 table without changing any values."],
  },
  {
    book: "05",
    page: 163,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is a model-answer prose page discussing the graph already restored on page 30."],
  },
  {
    book: "05",
    page: 165,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is a sample-answer commentary page, not a question prompt requiring another chart asset."],
  },
  {
    book: "05",
    page: 169,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is a sample answer describing the underground-railway table already reconstructed on page 99."],
  },
  {
    book: "06",
    page: 6,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: the introduction only lists possible IELTS question types; it contains no missing test visual."],
  },
  {
    book: "06",
    page: 31,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-06/page-031-writing-task-1-graph-table.png"],
    image: "data/generated/image-review/cambridge-ielts-06/page-031-writing-task-1-global-water-use-line-graph.png",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.

The graph and table below give information about water use worldwide and water consumption in two different countries.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

### Water consumption in Brazil and Congo in 2000

| Country | Population | Irrigated land | Water consumption per person |
|---|---:|---:|---:|
| Brazil | 176 million | 26,500 km² | 359 m³ |
| Democratic Republic of Congo | 5.2 million | 100 km² | 8 m³ |`,
    notes: ["Recreated the global-water-use graph at high resolution and converted the Brazil/Congo data into a native Markdown table."],
  },
  {
    book: "06",
    page: 38,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 3
Questions 21–30
Complete the tables below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

## Dissertation Tutorial Record (Education)

**Name: Sandy Gibbons**

| Targets previously agreed | Work completed | Further action suggested |
|---|---|---|
| Investigate suitable data-analysis software | Read IT **21 __________**; spoken to Jane Prince, Head of the **22 __________** | Sign up for some software-practice sessions |
| Prepare a **23 __________** for survey | Completed and sent for review | Add questions in section three on **24 __________** |
| Further reading about discipline | Read Banerjee; could not find Ericsson's essays on managing the **25 __________** | Obtain from library through special-loans service |

| New targets | Specific tasks | Timing |
|---|---|---|
| Do further work on Chapter 1 (give the title: *Context* **26 __________**) | Add statistics on the **27 __________** in various zones; include more references to works dated after **28 __________** | By the **29 __________** |
| Prepare list of main sections for Chapter 2 | Use index cards to help in organisation | Before starting the **30 __________** |`,
    notes: ["Reconstructed both Dissertation Tutorial Record tables as Markdown and restored the correct row/column relationships for blanks 21-30."],
  },
  {
    book: "06",
    page: 53,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.
The table below gives information about changes in modes of travel in England between 1985 and 2000.
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
Write at least 150 words.

Average distance in miles travelled per person per year, by mode of travel

| Mode of travel | 1985 | 2000 |
| --- | ---: | ---: |
| Walking | 255 | 237 |
| Bicycle | 51 | 41 |
| Car | 3,199 | 4,806 |
| Local bus | 429 | 274 |
| Long distance bus | 54 | 124 |
| Train | 289 | 366 |
| Taxi | 13 | 42 |
| Other | 450 | 585 |
| All modes | 4,740 | 6,475 |`,
    notes: ["Converted the OCR row stream into the original three-column Writing Task 1 table and checked all eighteen values against the rendered page."],
  },
  {
    book: "06",
    page: 99,
    status: "calibrated",
    reason: "visual_review",
    removeImages: ["data/generated/image-review/cambridge-ielts-06/page-099-writing-task-1-charts.png"],
    image: "data/generated/image-review/cambridge-ielts-06/page-099-writing-task-1-marriage-divorce-status-charts.png",
    notes: ["Restored both Writing Test 4 Task 1 charts, including legends, category labels and scales for marriage/divorce rates and marital status."],
  },
  {
    book: "06",
    page: 130,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is a Listening tapescript describing redevelopment plans, not a candidate-facing visual question page."],
  },
  {
    book: "06",
    page: 141,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is a tapescript page; visual-keyword matches occur in spoken prose and require no inserted asset."],
  },
  {
    book: "06",
    page: 162,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is the model answer discussing the water graph and table already restored on page 31."],
  },
  {
    book: "06",
    page: 168,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is sample-answer commentary discussing the charts already restored on page 99."],
  },
  {
    book: "07",
    page: 9,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: the introductory page only lists possible question types and contains no missing test visual."],
  },
  {
    book: "07",
    page: 34,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1
You should spend about 20 minutes on this task.
The table below gives information on consumer spending on different items in five different countries in 2002.
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
Write at least 150 words.

Percentage of national consumer expenditure by category - 2002

| Country | Food/Drinks/Tobacco | Clothing/Footwear | Leisure/Education |
| --- | ---: | ---: | ---: |
| Ireland | 28.91% | 6.43% | 2.21% |
| Italy | 16.36% | 9.00% | 3.20% |
| Spain | 18.80% | 6.51% | 1.98% |
| Sweden | 15.77% | 5.40% | 3.22% |
| Turkey | 32.14% | 6.63% | 4.35% |`,
    notes: ["Rebuilt the Writing Test 1 Task 1 consumer-expenditure data as a four-column table and checked all percentages against the rendered page."],
  },
  {
    book: "07",
    page: 39,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 13-18
Complete the table below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

| Stop / booking information | Attraction | Further information |
| --- | --- | --- |
| STOP A — Main Booking Office; First boat: 8 a.m.; Last boat: 13 __________ p.m. | Palace | has lovely 14 __________ |
| STOP B | 15 __________ | has good 16 __________ of city centre |
| STOP C | Museum | bookshop specialising in the 17 __________ of the local area |
| STOP D | Entertainment Complex | 18 __________ cinema; bowling alley; video games arcade |

Questions 19 and 20
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

19 How often do the Top Bus Company tours run?

20 Where can you catch a Number One Sightseeing Tour from?`,
    notes: ["Restored the three-column tour-attractions table and separated Questions 19-20 from the OCR-interleaved cells."],
  },
  {
    book: "07",
    page: 41,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 27 and 28
Complete the table below.
Write ONE WORD AND/OR TWO NUMBERS for each answer.

ANTARCTIC TREATY

| Date | Event |
| --- | --- |
| 1870 | Polar Research meeting |
| 27 __________ to __________ | 1st International Polar Year |
| 1957 | Antarctic Treaty was proposed |
| 1959 | Antarctic Treaty was 28 __________ |

Questions 29 and 30
Choose TWO letters, A-E.
Which TWO achievements of the Antarctic Treaty are mentioned by the speakers?

A no military use
B animals protected
C historic sites preserved
D no nuclear testing
E fishing rights protected`,
    notes: ["Rebuilt the Antarctic Treaty date/event table and preserved both date blanks in Question 27."],
  },
  {
    book: "07",
    page: 43,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 36-40
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Sport | Best laterality | Comments |
| --- | --- | --- |
| Hockey | mixed laterality | hockey stick has to be used in 36 __________; mixed-handed players found to be much more 37 __________ than others |
| Tennis | single laterality | gives a larger relevant field of 38 __________; cross-lateral players make 39 __________ too late |
| Gymnastics | cross laterality | gymnasts' 40 __________ is important for performances |`,
    notes: ["Rebuilt the laterality table and restored Question 40, which was absent from the OCR source."],
  },
  {
    book: "07",
    page: 57,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-057-writing-task-1-fish-meat-consumption-chart-image2.png",
    notes: ["Restored the Writing Test 2 Task 1 fish-and-meat consumption line graph with all four series and complete axes."],
  },
  {
    book: "07",
    page: 60,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 1 — Questions 1-10

Questions 1 and 2
Complete the notes below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

Example — Type of job required: Part-time

Student is studying 1 __________.
Student is in the 2 __________ year of the course.

Questions 3-5
Complete the table below.
Write NO MORE THAN TWO WORDS for each answer.

| Position Available | Where | Problem |
| --- | --- | --- |
| Receptionist | in the 3 __________ | evening lectures |
| 4 __________ | in the Child Care Centre | too early |
| Clerical Assistant | in the 5 __________ | evening lectures |`,
    notes: ["Rebuilt the jobs table and separated the preceding note-completion items from its cells."],
  },
  {
    book: "07",
    page: 77,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 22-25
Reading Passage 2 refers to the three-wave theory of early migration to the Americas. It also suggests in which of these three waves the ancestors of various groups of modern native Americans first reached the continent.

Classify the groups named in the table below as originating from

A the first wave
B the second wave
C the third wave

Write the correct letter, A, B or C, in boxes 22-25 on your answer sheet.

| Name of group | Wave number |
| --- | --- |
| Inuit | 22 __________ |
| Apache | 23 __________ |
| Pima-Papago | 24 __________ |
| Ticuna | 25 __________ |

Question 26
Choose the correct letter, A, B, C or D.
Write the correct letter in box 26 on your answer sheet.

Christy Turner's research involved the examination of

A teeth from both prehistoric and modern Americans and Asians.
B thousands of people who live in either the New or the Old World.
C dental specimens from the majority of prehistoric Americans.
D the eating habits of American and Asian populations.`,
    notes: ["Rebuilt the migration-wave classification table and retained Question 26 below it."],
  },
  {
    book: "07",
    page: 94,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: 'There are no pictures showing...' is Reading Passage prose, not a missing question figure."],
  },
  {
    book: "07",
    page: 105,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-07/page-105-writing-task-1-electricity-fuel-pie-charts-image2.png",
    notes: ["Restored all four Writing Test 4 Task 1 pie charts and their fuel-source legend for Australia and France in 1980 and 2000."],
  },
  {
    book: "07",
    page: 166,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is sample-answer prose for the consumer-spending table already reconstructed on page 34."],
  },
  {
    book: "07",
    page: 168,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is the model answer discussing the fish-and-meat graph already restored on page 57."],
  },
  {
    book: "07",
    page: 170,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is Writing sample-answer commentary, not a candidate-facing page with a missing chart."],
  },
  {
    book: "08",
    page: 4,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: the introduction lists possible question formats and contains no missing candidate-facing visual."],
  },
  {
    book: "08",
    page: 22,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: visual-keyword matches occur inside the Air Traffic Control reading passage, not in a visual question prompt."],
  },
  {
    book: "08",
    page: 23,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: references to flight plans and visual rules are passage prose; no figure is required on this page."],
  },
  {
    book: "08",
    page: 28,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 31-40
Complete the table below.
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 31-40 on your answer sheet.

Telepathy Experiments

| Name/Date | Description | Result | Flaw |
| --- | --- | --- | --- |
| Ganzfeld studies, 1982 | Involved a person acting as a 31 __________, who picked out one 32 __________ from a random selection of four, and a 33 __________, who then tried to identify it. | Hit-rates were higher than with random guessing. | Positive results could be produced by factors such as 34 __________ or 35 __________. |
| Autoganzfeld studies, 1987 | 36 __________ were used for key tasks to limit the amount of 37 __________ in carrying out the tests. | The results were then subjected to a 38 __________. | The 39 __________ between different test results was put down to the fact that sample groups were not 40 __________ (as with most ganzfeld studies). |`,
    notes: ["Rebuilt the four-column Telepathy Experiments table and restored the correct association of blanks 31-40."],
  },
  {
    book: "08",
    page: 33,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 4-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Item | Damage | Cost to repair/replace |
| --- | --- | --- |
| Television | The 4 __________ needs to be replaced | not known |
| The 5 __________ cabinet | The 6 __________ of the cabinet is damaged | 7 $ __________ |
| Dining room table | A 8 __________ is split | $200 |
| Set of china | Six 9 __________ were broken | about 10 $ __________ in total |`,
    notes: ["Rebuilt the insurance-damage table and restored the item, damage and cost columns for Questions 4-10."],
  },
  {
    book: "08",
    page: 52,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-052-writing-task-1-school-spending-pie-charts-image2.png",
    notes: ["Restored all three Writing Test 2 Task 1 school-spending pie charts with complete category labels and percentages for 1981, 1991 and 2001."],
  },
  {
    book: "08",
    page: 56,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 4-8
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Address | Rooms | Monthly rent | Problem |
| --- | --- | ---: | --- |
| Oakington Avenue | living/dining room, separate kitchen | £550 | no 4 __________ |
| Mead Street | large living room and kitchen, bathroom and a cloakroom | £580 | the 5 __________ is too large |
| Hamilton Road | living room, kitchen-diner, and a 6 __________ | £550 | too 7 __________ |
| Devon Close | living room, dining room, small kitchen | 8 £ __________ | none |`,
    notes: ["Rebuilt the accommodation table and restored all four address/room/rent/problem columns."],
  },
  {
    book: "08",
    page: 59,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 17-20
Complete the table below.
Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.

| Day | Time | Event | Venue | Ticket price |
| --- | --- | --- | --- | --- |
| Monday and Tuesday | 7.30 p.m. | 'The Magic Flute' (opera by Mozart) | 17 __________ | from £8.00 |
| Wednesday | 8.00 p.m. | 18 '__________' (Canadian film) | Cinema 2 | 19 £ __________ |
| Saturday and Sunday | 11 a.m. to 10 p.m. | 20 '__________' (art exhibition) | Gallery 1 | free |`,
    notes: ["Rebuilt the events table and restored the day, time, event, venue and ticket-price alignment for Questions 17-20."],
  },
  {
    book: "08",
    page: 77,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-08/page-077-writing-task-1-cement-concrete-process-image2.png",
    notes: ["Restored both Writing Test 3 Task 1 process diagrams, including all cement-production stages and the four concrete ingredients with proportions."],
  },
  {
    book: "08",
    page: 105,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is General Training reading prose about an insurance policy, not a missing table or chart prompt."],
  },
  {
    book: "08",
    page: 163,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is the model answer describing the school-spending charts already restored on page 52."],
  },
  {
    book: "08",
    page: 165,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is the sample answer for the process diagrams already restored on page 77."],
  },
  {
    book: "08",
    page: 167,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked: this is Writing sample-answer prose, not a candidate-facing visual prompt."],
  },
  {
    book: "09",
    page: 24,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-024-writing-task-1-island-development-maps-image2.png",
    notes: ["Restored the before-and-after island maps for Writing Test 1 Task 1, including all tourist facilities, paths, pier and swimming area."],
  },
  {
    book: "09",
    page: 29,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `SECTION 2 — Questions 11-20

Questions 11-13
Complete the table below.
Write NO MORE THAN THREE WORDS for each answer.

Parks and open spaces

| Name of place | Of particular interest | Open |
| --- | --- | --- |
| Halland Common | source of River Ouse | 24 hours |
| Holt Island | many different 11 __________ | between 12 __________ and __________ |
| Longfield Country Park | reconstruction of a 2,000-year-old 13 __________ with activities for children | daylight hours |

Questions 14-16
Choose the correct letter, A, B, or C.

Longfield Park

14 As part of Monday's activity, visitors will
A prepare food with herbs.
B meet a well-known herbalist.
C dye cloth with herbs.

15 For the activity on Wednesday,
A only group bookings are accepted.
B visitors should book in advance.
C attendance is free.`,
    notes: ["Rebuilt the Parks and open spaces table and preserved the two-part opening-time blank in Question 12."],
  },
  {
    book: "09",
    page: 57,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `TEST 3 — LISTENING — SECTION 1 — Questions 1-10

Questions 1-5
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Apartments | Facilities | Other information | Cost |
| --- | --- | --- | ---: |
| Rose Garden Apartments | studio flat | Example — Entertainment programme: Greek dancing | £219 |
| Blue Bay Apartments | large salt-water swimming pool | just 1 __________ metres from beach; near shops | £275 |
| 2 __________ Apartments | Terrace | watersports | £490 |
| The Grand | Greek paintings; 3 __________ | overlooking 4 __________; near a supermarket and a disco | 5 £ __________ |`,
    notes: ["Rebuilt the apartment-comparison table and restored the facilities, other-information and cost column alignment for Questions 1-5."],
  },
  {
    book: "09",
    page: 58,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 6-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

GREEK ISLAND HOLIDAYS

| Insurance benefits | Maximum amount |
| --- | --- |
| Cancellation | 6 £ __________ |
| Hospital | £600; additional benefit allows a 7 __________ to travel to resort |
| 8 __________ departure | Up to £1000; depends on reason |
| Personal belongings | Up to £3000; £500 for one 9 __________ |

Name of Assistant Manager: Ben 10 __________

Direct phone line: 081260 543216`,
    notes: ["Rebuilt the insurance-benefits table, corrected the heading spelling, and kept the manager and phone details outside the benefit rows."],
  },
  {
    book: "09",
    page: 60,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Area of work
A advertising
B animal care
C building
D educational links
E engine maintenance
F food and drink
G sales
H staffing

People
14 Simon (the speaker) __________
15 Liz __________
16 Sarah __________
17 Duncan __________
18 Judith __________

Questions 19 and 20
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Feature | Size | Biggest challenge | Target age group |
| --- | --- | --- | --- |
| Railway | 1.2 km | Making tunnels | |
| Go-Kart arena | 19 __________ m² | Removing mounds on the track | 20 __________ year-olds |`,
    notes: ["Rebuilt the theme-park feature table and kept the preceding people-to-work-area matching task separate."],
  },
  {
    book: "09",
    page: 80,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-080-writing-task-1-yemen-italy-population-pie-charts-image2.png",
    notes: ["Restored all four Yemen/Italy population-age pie charts, the age-band legend and every percentage for 2000 and 2050."],
  },
  {
    book: "09",
    page: 84,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `TEST 4 — LISTENING — SECTION 1 — Questions 1-10

Questions 1-4
Complete the table below.
Write ONE WORD ONLY for each answer.

Health Centres

| Name of centre | Doctor's name | Advantage |
| --- | --- | --- |
| The Harvey Clinic | Example — Dr Green | especially good with 1 __________ |
| The 2 __________ Health Practice | Dr Fuller | offers 3 __________ appointments |
| The Shore Lane Health Centre | Dr 4 __________ | |

Questions 5-6
Choose TWO letters, A-E.
Which TWO of the following are offered free of charge at Shore Lane Health Centre?

A acupuncture
B employment medicals
C sports injury therapy
D travel advice
E vaccinations`,
    notes: ["Rebuilt the Health Centres table and removed OCR bracket noise from the options for Questions 5-6."],
  },
  {
    book: "09",
    page: 85,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

Talks for patients at Shore Lane Health Centre

| Subject of talk | Date/Time | Location | Notes |
| --- | --- | --- | --- |
| Giving up smoking | 25th February at 7 p.m. | room 4 | useful for people with asthma or 7 __________ problems |
| Healthy eating | 1st March at 5 p.m. | the 8 __________ (Shore Lane) | anyone welcome |
| Avoiding injuries during exercise | 9th March at 9 __________ | room 6 | for all 10 __________ |`,
    notes: ["Rebuilt the patient-talks table and corrected the OCR spellings of Healthy eating and injuries."],
  },
  {
    book: "09",
    page: 92,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `35 The group did extensive reading on
A wildlife problems in rural areas.
B urban animal populations.
C current gardening practices.

36 The speaker focuses on three animal species because
A a lot of data has been obtained about them.
B the group were most interested in them.
C they best indicated general trends.

Questions 37-40
Complete the table below.
Write ONE WORD ONLY for each answer.

| Animals | Reason for population increase in gardens | Comments |
| --- | --- | --- |
| 37 __________ | suitable stretches of water | massive increase in urban population |
| Hedgehogs | safer from 38 __________ when in cities | easy to 39 __________ them accurately |
| Song thrushes | a variety of 40 __________ to eat; more nesting places available | large survey starting soon |`,
    notes: ["Rebuilt the urban-animals table and corrected the OCR phrase 'when I cities' to the printed 'when in cities'."],
  },
  {
    book: "09",
    page: 111,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-09/page-111-writing-task-1-us-energy-consumption-chart-image2.png",
    notes: ["Restored the Writing Test 4 Task 1 US energy-consumption graph with all six fuels, history/projection split and complete 1980-2030 axes."],
  },
  {
    book: "10",
    page: 3,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write ONE WORD AND/OR A NUMBER for each answer.

| Trip | Number of days | Total distance | Price per person | Includes |
| --- | ---: | ---: | ---: | --- |
| Trip One | 12 days | 7 __________ km | £525 | accommodation, car, one 8 __________ |
| Trip Two | 9 days | 980 km | 9 £__________ | accommodation, car, 10 __________ |`,
    notes: ["Rebuilt the two-trip comparison table from the printed page, preserving the four answer gaps and all supplied values."],
  },
  {
    book: "10",
    page: 12,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 9-13
Complete the table below.
Write ONE WORD ONLY for each answer.

| Stepwell | Date | Features | Other notes |
| --- | --- | --- | --- |
| Rani Ki Vav | late 11th century | as many as 500 sculptures decorate the monument | restored in the 1960s; excellent condition, despite the 9 __________ of 2001 |
| Surya Kund | 1026 | steps on the 10 __________ produce a geometrical pattern; carved shrines | looks more like a 11 __________ than a well |
| Raniji Ki Baori | 1699 | intricately carved monument | one of 21 baoris commissioned in the area by Queen Nathavatji |
| Chand Baori | 850 AD | steps take you down 11 storeys | old, deep and very dramatic; has 12 __________ which provide a view of the steps |
| Neemrana Ki Baori | 1700 | has two 13 __________ levels | used by the public today |`,
    notes: ["Rebuilt the five-row stepwell table and restored every date, feature, note and Questions 9-13 gap from the original."],
  },
  {
    book: "10",
    page: 46,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `WRITING TASK 1

You should spend about 20 minutes on this task.

The tables below give information about sales of Fairtrade-labelled coffee and bananas in 1999 and 2004 in five European countries.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

Fairtrade-labelled coffee sales (millions of euros)

| Country | 1999 | 2004 |
| --- | ---: | ---: |
| UK | 1.5 | 20 |
| Switzerland | 3 | 6 |
| Denmark | 1.8 | 2 |
| Belgium | 1 | 1.7 |
| Sweden | 0.8 | 1 |

Fairtrade-labelled banana sales (millions of euros)

| Country | 1999 | 2004 |
| --- | ---: | ---: |
| Switzerland | 15 | 47 |
| UK | 1 | 5.5 |
| Belgium | 0.6 | 4 |
| Sweden | 1.8 | 1 |
| Denmark | 2 | 0.9 |

Fairtrade: a category of products for which farmers from developing countries have been paid an officially agreed fair price.`,
    notes: ["Rebuilt both Fairtrade sales tables with all ten country rows, units, years and the printed explanatory note."],
  },
  {
    book: "10",
    page: 69,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-10/page-069-writing-task-1-destination-charts.png",
    notes: ["Restored both 2008 UK graduate and postgraduate destination bar charts with complete axes, category labels and values."],
  },
  {
    book: "10",
    page: 73,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 7-10
Complete the table below.
Write ONE WORD ONLY for each answer.

| Area | Work to be done | Notes |
| --- | --- | --- |
| Kitchen | Replace the 7 __________ in the door. | Fix tomorrow. |
| Kitchen | Paint wall above the 8 __________. | Strip paint and plaster approximately one 9 __________ in advance. |
| Garden | One 10 __________ needs replacing (end of garden). | |`,
    notes: ["Rebuilt the kitchen-and-garden work table with the printed row grouping, instructions and Questions 7-10 gaps."],
  },
  {
    book: "10",
    page: 75,
    status: "calibrated",
    reason: "structured_table_repair",
    text: `Questions 16-20
Complete the table below.
Write ONE WORD ONLY for each answer.

Tourist attractions in Manham

| Place | Features and activities | Advice |
| --- | --- | --- |
| copper mine | specially adapted miners' 16 __________ take visitors into the mountain | the mine is 17 __________ and enclosed, so it is unsuitable for children and animals |
| village school | classrooms and a special exhibition of 18 __________ | a 19 __________ is recommended |
| 'The George' (old sailing ship) | the ship's wheel has been restored | children should not use the 20 __________ |`,
    notes: ["Rebuilt the three-attraction Manham table and restored the five answer gaps and all printed advice."],
  },
  {
    book: "10",
    page: 93,
    status: "calibrated",
    reason: "visual_review",
    image: "data/generated/image-review/cambridge-ielts-10/page-093-writing-task-1-salmon-life-cycle.png",
    notes: ["Restored the complete salmon life-cycle diagram, including river and sea stages, durations, directional arrows and fry/smolt/adult size key."],
  },
  {
    book: "10",
    page: 108,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked against the original: this is a General Training letter task mentioning study plans, with no missing chart, diagram or table."],
  },
  {
    book: "10",
    page: 139,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked against the original: this is continuous listening-tapescript prose, not a page containing a missing visual or table."],
  },
  {
    book: "10",
    page: 156,
    status: "calibrated",
    reason: "false_positive_text_page",
    notes: ["Manually checked against the original: this is a model-answer page referring to visual data, with no source chart or table to restore."],
  },
  {
    book: "07",
    page: 100,
    status: "calibrated",
    reason: "structured_table_repair",
    appendText: `Structured reconstruction of Table 1: Proofreading Errors and Noise

| Noise level | Unpredictable noise | Predictable noise | Average |
| --- | ---: | ---: | ---: |
| Loud noise | 40.1 | 31.8 | 35.9 |
| Soft noise | 36.7 | 27.4 | 32.1 |
| Average | 38.4 | 29.6 | |`,
    notes: ["Manually reconstructed the reading-passage data table from the original row and column values without replacing the surrounding passage text."],
  },
  {
    book: "08",
    page: 16,
    status: "calibrated",
    reason: "text_structure_repair",
    appendText: `Structured notes: Publishing findings

- Maps
  - easy to carry
  - can show physical features of large and small areas
  - but a two-dimensional map will always have some 38 __________
- Aerial photos
  - can show vegetation
  - problem: 39 __________
- Landsat pictures
  - sent to receiving stations
  - used for monitoring 40 __________ conditions, etc.`,
    notes: ["Reconstructed the three-part note-completion hierarchy and blanks 38-40 from the original page."],
  },
  {
    book: "08",
    page: 85,
    status: "calibrated",
    reason: "structured_table_repair",
    appendText: `Australian Aboriginal Rock Paintings

Painting styles: A Dynamic; B Yam; C Modern.

| Question | Feature | Style (A, B or C) |
| ---: | --- | --- |
| 31 | figures revealing bones | __________ |
| 32 | rounded figures | __________ |
| 33 | figures with parts missing | __________ |
| 34 | figures smaller than life size | __________ |
| 35 | sea creatures | __________ |
| 36 | plants | __________ |`,
    notes: ["Reconstructed the painting-style matching table and retained all six features and answer choices A-C."],
  },
  {
    book: "10",
    page: 53,
    status: "calibrated",
    reason: "structured_table_repair",
    appendText: `Questions 26-30: Stages in doing the 'year abroad' option

Actions: A be on time; B get a letter of recommendation; C plan for the final year; D make sure the institution's focus is relevant; E show ability in Theatre Studies; F make travel arrangements and bookings; G ask for help.

| Question | Stage | Action (A-G) |
| ---: | --- | --- |
| 26 | in the second year of the course | __________ |
| 27 | when first choosing where to go | __________ |
| 28 | when sending in your choices | __________ |
| 29 | when writing your personal statement | __________ |
| 30 | when doing the year abroad | __________ |`,
    notes: ["Reconstructed the action box and the five-stage matching table from the original listening page."],
  },
  ...[9, 49, 54, 76, 85, 90, 123].map((page) => ({
    book: "04", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 04 page ${page}: the keyword occurs in continuous passage, prompt or explanatory text; no missing candidate-facing visual or table is present.`],
  })),
  ...[10, 12, 17, 18, 22, 45, 72, 91, 105, 116, 120, 130, 138, 139, 140, 145, 149].map((page) => ({
    book: "05", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 05 page ${page}: the keyword occurs in ordinary text, transcript, answer guidance or a non-visual expression; no missing candidate-facing visual or table is present.`],
  })),
  ...[10, 22, 91, 127, 142, 164, 170].map((page) => ({
    book: "06", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 06 page ${page}: the keyword occurs in ordinary passage, prompt, transcript, sample answer or furniture wording; no missing candidate-facing visual or table is present.`],
  })),
  ...[13, 30, 42, 45, 48, 49, 53, 81, 101, 121, 122, 129, 130, 172, 176].map((page) => ({
    book: "07", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 07 page ${page}: the visual keyword is used in passage, prompt, sample answer or ordinary prose; no missing candidate-facing visual or table is present.`],
  })),
  ...[8, 17, 38, 60, 64, 65, 106, 116, 130, 133, 134, 135, 136, 140, 146, 147, 148, 149, 151].map((page) => ({
    book: "08", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 08 page ${page}: the keyword occurs in passage, transcript, answer key or ordinary task wording; no additional candidate-facing visual or table is missing.`],
  })),
  ...[19, 20, 122, 130, 142, 145].map((page) => ({
    book: "09", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 09 page ${page}: the keyword is a reference inside passage or transcript text; no missing candidate-facing visual or table is present.`],
  })),
  ...[9, 10, 13, 59, 66, 80, 102, 113, 124, 128, 140, 143, 161].map((page) => ({
    book: "10", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 10 page ${page}: the keyword occurs in passage, prompt, transcript, answer key or sample response; no missing candidate-facing visual or table is present.`],
  })),
  ...[44, 45, 103].map((page) => ({
    book: "11", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 11 page ${page}: the keyword occurs in reading prose or a transcript referring to an already calibrated map; no new visual or table is present.`],
  })),
  ...[67, 106].map((page) => ({
    book: "12", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 12 page ${page}: the keyword is ordinary passage or transcript wording; no missing candidate-facing visual or table is present.`],
  })),
  ...[64].map((page) => ({
    book: "13", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 13 page ${page}: “figure out” is ordinary passage wording; no visual or table is present.`],
  })),
  ...[33, 67].map((page) => ({
    book: "14", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 14 page ${page}: the keyword occurs in a preceding question page or ordinary passage wording; no missing visual or table is present.`],
  })),
  ...[24, 26, 60, 61, 63, 135].map((page) => ({
    book: "15", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 15 page ${page}: the keyword occurs in continuous passage, timeline or sample answer; no missing candidate-facing visual or table is present.`],
  })),
  ...[40, 115].map((page) => ({
    book: "16", page, status: "calibrated", reason: "false_positive_text_page",
    notes: [`Manually checked Cambridge 16 page ${page}: “figures” refers to land art or sales numbers in prose; no missing candidate-facing visual or table is present.`],
  })),
];

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function replaceMarkdownPage(text, page, body) {
  const headingPattern = /^## Page \d+\r?$/gm;
  const headings = [...text.matchAll(headingPattern)].map((match) => ({
    page: Number(match[0].match(/\d+/)[0]),
    index: match.index,
  }));
  const currentIndex = headings.findIndex((heading) => heading.page === page);
  if (currentIndex < 0) throw new Error(`Could not find markdown page ${page}`);
  const start = headings[currentIndex].index;
  const end = currentIndex + 1 < headings.length ? headings[currentIndex + 1].index : text.length;
  const prefix = text.slice(0, start);
  const suffix = text.slice(end).replace(/^\r?\n+/, "");
  const replacement = `## Page ${page}\n\n${body.replace(/\n+$/, "")}`;
  return `${prefix}${replacement}${suffix ? `\n\n${suffix}` : "\n"}`;
}

function shouldEmbedImage(entry) {
  return Boolean(entry.image) && ["visual_review", "visual_review_adjacent", "short_page_ocr_repair"].includes(entry.reason);
}

function imageMarkdown(entry) {
  return `![Cambridge IELTS ${entry.book} page ${String(entry.page).padStart(3, "0")} figure](${entry.image})`;
}

function withEmbeddedImage(entry, text) {
  const body = String(text || "").replace(/\n+$/, "");
  if (!shouldEmbedImage(entry)) return body;
  const marker = imageMarkdown(entry);
  if (body.includes(marker)) return body;
  return `${body}\n\n${marker}`;
}

function withAppendedText(entry, text) {
  const body = String(text || "").replace(/\n+$/, "");
  const supplement = String(entry.appendText || "").trim();
  if (!supplement || body.includes(supplement)) return body;
  return `${body}\n\n${supplement}`;
}

function withoutRemovedImages(entry, text) {
  const removals = Array.isArray(entry.removeImages) ? entry.removeImages : [];
  if (!removals.length) return String(text || "");
  return String(text || "")
    .split(/\r?\n/)
    .filter((line) => !removals.some((image) => line.includes(`](${image})`)))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function applyBookCalibrations(book, entries) {
  const rawFile = path.join(TEXT_PAGES, `cambridge-ielts-${book}.raw.md`);
  const pagesFile = path.join(PAGE_JSON, `cambridge-ielts-${book}.pages.json`);
  const pagesDoc = readJson(pagesFile);
  let raw = readText(rawFile);
  let changes = 0;

  for (const entry of entries) {
    const page = (pagesDoc.pages || []).find((item) => item.page === entry.page);
    if (!page) throw new Error(`Could not find page-json ${book} page ${entry.page}`);
    const nextText = withEmbeddedImage(entry, withAppendedText(entry, withoutRemovedImages(entry, entry.text || page.text)));
    if (entry.text || entry.appendText || entry.removeImages || shouldEmbedImage(entry)) raw = replaceMarkdownPage(raw, entry.page, nextText);
    if (page.text !== nextText || !page.calibration) {
      page.text = nextText;
      const calibration = {
        status: entry.status,
        reason: entry.reason,
        image: entry.image,
      };
      if (shouldEmbedImage(entry)) calibration.embeddedInText = true;
      page.calibration = calibration;
      changes += 1;
    }
  }

  if (raw !== readText(rawFile)) {
    writeText(rawFile, raw);
    changes += 1;
  }
  writeJson(pagesFile, pagesDoc);
  return changes;
}

function writeLedger(entries) {
  const jsonFile = path.join(REPORTS, "cambridge-ocr-calibration.json");
  const mdFile = path.join(REPORTS, "cambridge-ocr-calibration.md");
  const existing = fs.existsSync(jsonFile) ? readJson(jsonFile) : { entries: [] };
  const byKey = new Map((existing.entries || []).map((entry) => [`${entry.book}-${entry.page}`, entry]));
  const checkedAt = new Date().toISOString();

  for (const entry of entries) {
    const ledgerEntry = {
      book: entry.book,
      page: entry.page,
      status: entry.status,
      reason: entry.reason,
      image: entry.image,
      checkedAt,
      notes: entry.notes,
    };
    if (shouldEmbedImage(entry)) ledgerEntry.embeddedInText = true;
    byKey.set(`${entry.book}-${entry.page}`, ledgerEntry);
  }

  const ledger = {
    generatedAt: checkedAt,
    entries: [...byKey.values()].sort((a, b) => a.book.localeCompare(b.book) || a.page - b.page),
  };
  writeJson(jsonFile, ledger);

  const lines = [
    "# Cambridge OCR Calibration Ledger",
    "",
    `Generated at: ${checkedAt}`,
    "",
    "| Book | Page | Status | Reason | Image | Notes |",
    "| --- | ---: | --- | --- | --- | --- |",
    ...ledger.entries.map((entry) => {
      const notes = (entry.notes || []).join(" ");
      return `| ${entry.book} | ${entry.page} | ${entry.status} | ${entry.reason} | ${entry.image} | ${notes.replace(/\|/g, "\\|")} |`;
    }),
    "",
  ];
  writeText(mdFile, lines.join("\n"));
  return { jsonFile, mdFile, count: entries.length };
}

function main() {
  const byBook = new Map();
  for (const entry of calibrations) {
    if (!byBook.has(entry.book)) byBook.set(entry.book, []);
    byBook.get(entry.book).push(entry);
  }

  let changes = 0;
  for (const [book, entries] of byBook) {
    changes += applyBookCalibrations(book, entries);
  }
  const ledger = writeLedger(calibrations);

  console.log(`applied ${calibrations.length} page calibrations with ${changes} changed groups`);
  console.log(`wrote ${rel(ledger.jsonFile)}`);
  console.log(`wrote ${rel(ledger.mdFile)}`);
}

main();
