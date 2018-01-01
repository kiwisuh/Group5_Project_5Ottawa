/*
 *this edited from mr. doob's ball pool http://mrdoob.com/projects/chromeexperiments/ball-pool/
 *
 *
 */

var canvas;
var counter = 0;

var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var density = 1;
var restitution = 0.80;
var friction = 0.1;
var themes = [ [ "#FFFFFF", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0" ]];
var theme;

var worldAABB, world, iterations = 1, timeStep = 1 / 15;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var bodies, elements, text;

var createMode = false;
var destroyMode = false;

var isMouseDown = false;
var mouseJoint;
var mouse = { x: 0, y: 0 };
var gravity = { x: 0, y: 0 };

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;

//leaf information
var title_leaf;
var description_leaf;
var time_leaf;
var location_leaf;
var price_leaf;
var media_leaf;

//leaf effects
var hueVal;

//img slides
var slideIndex = 1;

init();
play();

function init() {

	canvas = document.getElementById( 'canvas' );
	canvas.onmousedown = onDocumentMouseDown;
	
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;


	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d

	worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );

	setWalls();

	bodies = [];
	elements = [];

	for( i = 0; i < 50; i++ ) {
		createLeaf();
		hueVal = 'hue-rotate('+ Math.random()*100 +'deg)';
	}


	//leaf information
	title_leaf = ["Boutique Hunting", "Rideau Centre Shopping", "Used Book Stores", "Blumenstudio", "Ottawa's Best Burger", "House of TARG", "El Camino", "Suzy Q", "Ward 14", "Wag Cafe", "High Teas", "Stella Luna", "Kettleman's", "Pub Italia", "Playa del Popsical", "Rideau Street McDonald's", "Flapjack's",
	"Mayfair", "Remi Royale", "China Doll Karaoke", "Extreme Sports", "Vertical Reality", "LIVE! On Elgin", "The Loft", "The Mud Oven", "Lowertown Brewery Bingo", "Yoga on Parliament", "Dundonald Park Movies",
	"Run Ottawa", "Sens Game", "TD Place", "Canada Day on the Hill", "Nature Nocturne", "Winterlude", "Music Festivals", "Tulip Festival", "Hot Air Balloon Festival", "Dragon Boat Festival", "Gatineau", "Hog's Back Falls",
	"Tin House", "Love Lock Bridge", "Glebe Photoshoot", "Bike through the city", "Chateau Laurier", "Rideau Canal Skating", "Tour of Parliament", "Ride OCTranspo", "NAC", "Art Gallery"];
//redo description, array is messed
	description_leaf = ["We love the newly minted Rideau Centre, but sometimes you want to add some more unique pieces to your wardrobe and Ottawa has some great boutiques to do that.",
	"Over the last couple of years, the popular downtown mall has undergone a significant makeover, adding new stores and eateries to its directory. Grab some friends or go solo and prepare to juggle one too many bags discovering what this bustling mall has to offer. And don't forget to look up, the Rideau Centre and its pristine white interior, large skylight windows and intricate roofs provide and aesthetic that's not to be missed. For an incredible view of the city, head to the cafe nestled in the 4th floor of Simon's. Trust us.",
	"If you've had the pleasure of seeing the Parliament Hill library and rightfully dubbed it your library goals, check out some of Ottawa's used book stores to bulk up your own collection.",
	"Are you about as nurturing as a desert? Adding greenery to our rooms and apartments is getting more and more popular, but sometimes taking care of ourselves is a task let alone keeping something else alive. Luckily, Blumenstudio always has an impressive stock of low maintenance cacti, succulents, and house plants. They also assemble some of the most gorgeous floral arrangements. What makes this Parkdale floral shop unique is that it's not only beautifully curated and that the interior is what our Pinterest dreams are made of, they are also a cafe and offer baked goods and lattes.",
	"Before you take us up on this challenge - just know, Ottawa has A LOT of great burgers. From the iconic 'Burgers n' Fries Forever,' to the Ottawa-born 'The Works' and the Byward-market favourite 'The King Eddy,' this might be the toughest competition to judge. Vegetarian or just really into meatless Mondays? We've got you covered. You might not think a Scottish bar would take the best veggie burger award, but the Highlander's veggie burger is out of this world.",
	"Who would have known that in a dark basement on Bank Street there's a restaurant and live music venue filled with over 40 pinball machines, arcade games and some of the most enticing handmade pierogies you'll ever have? Go on Sunday after 9 p.m. and it's only $5 for you to play as much pinball as you can handle.",
	"Make your Taco Tuesday an El Camino Taco Tuesday! If you're looking for some of Ottawa's best tacos and artisnal cocktails, look no further than Elgin Street's El Camino. If you're in a rush you can order tacos to go from their take-out window, but there's nothing quite like the ambience of El Camino. It has a relaxed, cool feel and the extra boozy margaritas are unmatched. Those margaritas are no joke, they're on the pricier side but they're packed with 3 ounces of tequila - you'll definitely feel a little something after one. Don't underestimate the eggplant taco - it's likely one of the best tacos on offer!",
	"You haven't had a doughnut until you've had a Suzy Q doughnut. No shade to the doughnuts at Tim Horton's because those will always be a Canadian treasure, but Suzy Q knows how to make a doughnut. Each artisnal O of dough is just $2, and given the quality and interesting flavour concoctions it's well worth it. The Maple Bacon is the most popular so try that, and the Spicy Pineapple, and Dirty Chocolate, and the Blue Vanilla Fruit Loop, you know what, just try them all.",
	"You walk into a bar, sit on one of the stools at the bartop, down a few cocktails or tequila shots. The alcohol is flowing and you start to realize how comfortable your seat is and how it swivels just right. Maybe a few more drinks in you slap some cash down and walk out with a receipt with your drinks on it and your beloved chair. This is not a preamble to some cheesy joke, this is a perfectly viable situation at Ward 14 - Ottawa's newest bar/consignment store. Everything you see in the bar, including the smallest of knick knacks, can be bought and is later replaced with something else, which means that there's always going to be new, exciting things to find.",
	"Dogs? Coffee? Baked Goods? We're in! Whether you want to share some quality time with your own dog or just need a little dog therapy, Wag Cafe has got you covered. Prepare for an onslaught of emotions because nothing can quite compare to being in a large space full of adorable dogs.",
	"Get your pinkies out and give your livers a break with some delicious afternoon tea, scones, finger sandwiches, and desserts.",
	"Stella Luna is pure, authentic Italian gelato, brought to the streets of Ottawa. This small cafe almost always has a line, but the wait is well worth it. They're closed on Mondays so every Sunday night at 9 p.m. they do a 40% off sale to get rid of any leftover gelato. They even had a line down the street on Christmas Eve - so it's obvious how life-changing this gelato is. Fun fact: they have a magical labour-inducing concoction. Listen below as store owner Tammy discusses the Stella baby boom",
	"Don't even try to argue on this one because anyone from Ottawa will fight you to the death, hunger game style. Kettleman's. Bagels. Are. The. Best. Bagels. Ever. Period. They're perfectly cooked. They're perfectly cream-cheesed, or sandwiched, or toasted or presented in any form, really. Did we mention they're open 24/7? We know McDonald's just brought all day breakfast to Canada and that' cool, but why have that when you can grab a breakfast bagel with cheese, bacon, and egg on a Montreal-style bagel for under $5? Just make sure to bring cash with you. Kettleman's only accepts cash and even though they have an ATM with a relatively cheap service fee, nobody wants to pay for their money, am I right?",
	"An Ottawa beer lovers haven tucked in Little Italy. With every table proudly propping up the large, black leather-bound beer bible on a stand, you can flip through over 200 beers from around the world. Close your eyes and pick - you can't go wrong. The bar, with its dark ambience and packed full of stain glass windows, church pews, and high, vaulted ceilings, is the perfect place to worship the holy drink.",
	"Even though there are a few beaches in Ottawa, they are by no means a paradise (sorry Mooney's Bay!), but just because we can't be ten pina coladas deep in Hawaii lying in the sand, doesn't mean we can't get that feeling in Ottawa. In the warmer months, Playa del Popsical lays out its sandy beaches, sprawls out their beach chairs and pops its beach umbrellas in the Bank Street alley formerly occupied by Flapjack's. This seasonal food truck offers delicious and refreshing popsicles!",
	"The Rideau Street McDonald's is known around the city to be a little bit sketchy, but also the perfect place for some post-drinks greasy food. You never know what's going to happen at this location and the stories you can tell are part of its charm - like the time a man pulled a baby raccoon out of his jacket pocket in the middle of an altercation",
	"When a restaurant's logo includes red plaid and a happy, ax-wielding lumberjack, you know it's going to be serving up some hearty Canadian fare. Douse your meal in real Canadian maple syrup, get a pancake sandwich or breakfast poutine and dig in!",

	"There are so many reasons to make the Mayfair your go-to theatre. Not only is it Ottawa's oldest active movie theatre, but it also boasts a rich Spanish Revival interior with faux balconies, a painted ceiling, stain-glass windows. They screen a number of independent and second-run films so keep an eye on the ever-changing schedule. We suggest you go for a special screening of a cult film like Rocky Horror Picture Show or the Room. In these films, audience participation is encouraged as a theatre group acts out the film, toast is thrown, spoons are thrown, profanities are shouted. Or for some more wholesome fun there are special all-you-can-eat cereal events with screenings of old school cartoons on Saturday mornings. Grab one of the couches in the back, sit back and prepare to be entertained.",
	"Often dubbed Ottawa's best performer, Remi Royale is really a spectacle. Talk to any native Ottawan who knows the ins and outs of Ottawa's entertainment scene and they'll suggest you check him out at the Manx. In his show, he offers a 'no-holds-barred' karaoke and comedy show. He strips, he sings, he gets the crowd roaring. The Manx suggests that you leave your shame at the door.",
	"Possibly Chinatown's best kept secret: every Saturday night starting at 9 p.m. The Shanghai Restaurant hosts a karaoke night with one of Ottawa's beloved Drag Queen hosts: China Doll! Her sass is probably as big as her hair and she sings Christina Aguilera's Ain't No Other Man unlike anyone you've ever seen. Don't believe us? Request to sing another Aguilera song and she just may challenge you to a diva off.",
	"The wave of extreme sport activities is taking over Ottawa. For all the adrenaline junkies who aren't revved up by a Friday night movie, there are a few more offbeat options. Go to BATL and throw some axes or head to Archery Games with some friends and compete in archery tag.",
	"If you've ever wanted to feel like Rocky training in an abandoned warehouse, Vertical Reality is the place for you. The rock climbing gym is located on Victoria Island in an old warehouse with an industrial, abandoned vibe. The high ceilings make for a great climbing gym and the multiple rooms offer something for everyone. Check out our 360 degree content below, just try not to get vertigo looking up that high!",
	"Magic shows, live music, burlesque, comedy, trivia nights... LIVE! On Elgin is the venue in Ottawa that has it all. LIVE! On Elgin gives people in the city the chance to not only take in some entertainment, but also to show-off their star potential with an open-mic night every Tuesday. With an event every single day, there's something for everyone. There's no excuse to say nothing ever happens in Ottawa anymore!",
	"Have a game night at The Loft! This restaurants resembles a library, but a library filled with hundreds of games. There are options for everyone no matter the size of your group! Each staff member knows about more games than you will probably ever know in your lifetime so you can play some of your favourites, but also make sure to ask for something new - you may even find a new favourite. Just be careful if you choose to play Monopoly because flipping tables is not recommended in a public space.",
	"Channel your inner Demi Moore in Ghost and learn how to make a pottery vase or just some amalgamous blob that you can dub 'modern art' if anyone asks. You may not have a chiseled Patrick Swayze spirit to guide your hands as you go, but you'll be instructed by knowledgeable staff. You can even skip the whole messy, clay-covered portion if you'd like and check out the ready-made items that the Mud Oven has to offer for clients to paint.",
	"The only thing that could potentially make screaming 'Bingo' better is screaming it in a bar with great food a pint of craft beer beside your card. This isn't your great-aunt's Bingo match. Trust us on this one. Yes, prizes are involved too.",
	"Every Wednesday at noon, join Lululemon along with hundreds of fellow yogis on the lawn of Parliament Hill for an hour-long yoga session taught by local instructors. This is your unique chance to have a view of the Peace Tower while standing strong in Warrior or Downward Dog. Honestly, you could just bring a mat and lie in Savasana and work on your tan if you really wanted to - there's no judgment in the yogi world. Take your mat, a water bottle and get your om on!",
	"What's better than watching a movie in the summer under the stars? Watching a free movie in the summer under the stars. Every summer, Centretown Movies hosts an outdoor film festival in the park so bring a blanket and some movie snacks and prepare for a truly unique screening experience. Make sure to check out the Centretown Movies website for a movie schedule",
	"Take advantage of all the beautiful canal and river side pathways in Ottawa and join - the city's premiere running organization. Other than getting some fresh air and getting in top running shape, members are offered some benefits, like organized group runs, a free race, discounts at local shoe stores (who doesn't love a good excuse to do a little shopping?) and discounts on all Run Ottawa events. Take a look below at what Run Ottawa organizer Lisa Georges has to say about why joining Run Ottawa is worth lacing up for.",
	"Let's put it this way: you're in the nation's capital and, if you buy into stereotypes, Canadians eat, sleep, and breathe hockey. Seeing a Senators game is like a rite of passage. Even if you're not hockey's biggest fan, there's nothing quite like cheering with people donned in the red, white, and black, and chugging back a few beers. If a Sens game isn't necessarily always in your budget another fun option is to go see the 67's play and see what the up-and-coming young players have to offer. ",
	"Football, hockey, soccer, there really is a sport for everyone at TD Place. Cheer on your favourite hometown team while donning your red, white and black gear. Looking for a more niche sport? TD Place has also hosted figure skating competitions and curling tournaments in the past, among others. Can't afford those hefty ticket prices? Grab a blanket and some snacks and head to the lawn right outside the stadium - it's free, the view is pretty good and there's always a crowd so you still get that sport-going vibe, but without the price tag.",
	"Is there any better place to be on Canada Day than the nation's capital? Roam around Parliament Hill with thousands of celebrating Canadians, sit on the lawn and take in the many musical acts lined up all day and night, and finish the evening off with a fireworks display right on Parliament Hill.",
	"Have you ever wanted to wear a suit or heels and a dress and walk around a museum with a cocktail in hand, glow sticks and music booming? We love the fact that Thursday evenings offer free museum admissions, but up the ante with a Nature Nocturne. You can sip some drinks and stare lovingly into a dinosaur's eyes, maybe even give them a hug if the feeling is mutual. Nature Nocturnes are hosted after hours every month, on the last Friday of the month. This is like a real-life Night at the Museum, but without Ben Stiller. ",
	"Let's get real for a second, Ottawa winters can suck sometimes. It's cold. It's icy. It can be a bit bleak. But having the world's largest skating rink and a winter festival packed full of ice installations and fun-filled events makes the winter chill worth it. Make sure to check out the ice sculptures as they're being carved - it's like watching some real-life Frozen magic!",
	"If you're still thinking that Ottawa is the city that fun forgot, you haven't checked out their music festival lineups in the past few years. Kanye, James Bay, Lady Gaga, Of Monsters and Men, and the Red Hot Chili Peppers have all graced Ottawa's stages in the past few years. This year's lineups - a special 150 celebration - promise not to disappoint either. Make sure to check out Bluesfest, Cityfolk, and Escapade. We just don't know how you'll be able to pick!",
	"If the love story between Canada and the Netherlands doesn't melt your heart, you might just be colder than a winter day in Ottawa. I'm not going to get into details (you can find those here) but Canada sanctioned a hospital room international territory during WW2 so the Netherland's Princess Juliana could be born a Dutch citizen. As thanks, the Dutch have sent upwards of a million tulips to Canada, with a special Canada-flag inspired on this year!",
	"If you're anything like us then you probably get unjustifiably excited when you see one single Remax hot air balloon skimming the skyline. But you know what's better than one lone sponsored aerial display? An entire festival devoted to hot air balloons featuring a rainbow of colours scattered across the Ottawa skyline. Every summer, right before school starts Gatineau hosts this festival in Parc le Baie, but no matter where you are in the city it's hard to miss. The festival also features vendors, live entertainment, and a variety of activities so it's worth checking out from more than just your window!",
	"Come out and see North America's largest dragon boat festival. Hosted every year at Mooney's Bay, hundreds of dragon boat teams in non-stop racing. But the festival has much more to offer, including a lineup of free entertainment. This year, the festival added a winter race, and if seeing ornamental boats skid across a frozen lake isn't one of the most confusing and mesmerizing things you've ever seen then we don't know what is.",
	"If you're in the mood for a little adventure, cross the river and venture into Gatineau and its rolling hills. No matter what your fitness level the Gatineau Hills are a great place to go for a light walk or a full on sweat session running around the more intermediate trails. Even if hiking isn't your thing, a day in Gatineau has so much to offer. A visit to the Canadian Museum of History (free on Thursdays!), a meal at Biscotti & Cie with its love letters from around the world, or a skate in the forest if you need a break from the Rideau Canal.",
	"If you can't make it out to Gatineau Park for a stroll, walking around Hog's Back Park is the best way to escape the city. The park's greatest feature are the Hog's Back Falls - the point where the Rideau Canal splits from the Rideau River. If you head out on a Sunday morning you may even catch a glimpse of a large group donned in period clothing live-action role playing.",
	"Embody your modern day Romeo and check out the Tin House facade tucked away in the Sussex Drive courtyard. While passersby may think you look crazy yelling, 'What's up, Juliet? Come hang!' at a balcony, the facade is a hidden little Ottawa secret. The attraction was installed in 1973, after a reconstruction of the facade of Honore Foisy was commissioned.",
	"Paris, is that you? Ok, so this may not be the Pont des Arts, but Ottawa's Corkstown Bridge is starting to wrack up its own impressive collection of locks secured by lovers. Take your Dudleys, because we all know all you gym-goers and high school grads have them, bring your significant other, best friend or just lock one for yourself and throw away the key in the Rideau Canal below.",
	"One of the cutest areas in Ottawa (arguably) the Glebe offers more than just shops and restaurants! Make sure to check out the great artwork spread across walls in Ottawa's South side. The most popular place? The strip in between Fourth and Third Street right next to Mrs. Tiggy Winkles.",
	"Ottawa is an active city - at any given moment there are runners, walkers, and bikers on pathways all around the city. Grabbing your own bike or renting one is a great way to get to know the different neighbourhoods this city has to offer. Scroll through our map below to take a look at some of the best areas to bike around and a few suggestions on the best way to explore them!",
	"Ottawa is the home of many castles and the Chateau Laurier is arguably its most stately and beautiful. When it first opened in 1912, a private room cost $2 a night. Now you'd be lucky to get a bottle of water in the cafe for that price, but if you ever have the chance to stay drop anything and everything to do so or splurge for a meal or afternoon tea. Take a Haunted Walk tour and find out about the eerie events that have haunted its ornamental halls and rooms.",
	"Now that the winter's in Ottawa are more up and down than our moods, the Canal is a bit more sporadic in terms of when it's open for skating. But keep an eye out for those perfect winter weekends, lace up and enjoy this UNESCO site. It's the world's largest skating rink and one of the most fun and unique ways to travel in the city. You can grab a Beaver Tail along the way and twirl around like Tessa Virtue, we'll just turn a blind eye to all the falls along the way.",
	"You're in the Nation's capital, take the Parliament tour. It's free. Just do it. You will not regret it. Make sure to get there early in the morning to pick up tickets, though. They're usually all gone before noon on weekends!",
	"From buses to trains to the soon-to-be-integrated LRT system, Ottawa City Transportation (or OC Transpo for short) is what we can call an 'integral' part of visiting the city. Yes, the bus may not show up on time (or ever...) but what fun is it if things are always consistent? The upside, you can have two adults and four children ride for $10.25 all day on weekends and holidays. Just ask the driver for a day pass.",
	"Ottawa is home to one of the largest performing arts facilities in Canada and works with artists and performers from across the country - so take advantage of it! Its home to the National Arts Centre Orchestra, one of the country's best, it hosts theatre performances in both French and English, dance performance, including the Nutcracker every year! The best part? There are subscription discounts, student discounts, student rush tickets, and pay-what-you-can shows, so make sure to check out their schedule for the details!",
	"The National Gallery of Canada holds some of Ottawa's greatest treasures. Make sure to check out the latest exhibitions on display, and browse works by the likes of the Group of Seven, Salvador Dali and the highly controversial Voice of Fire painting. The best part? Like most galleries and museums in Ottawa, it's free every Thursday evening. "];
	time_leaf = ["Victoire Boutique <br /> Hours: Mon.-Wed. & Sat.: 10AM-6PM <br /> Thurs. & Fri.: 10AM-8PM <br /> Sun.: 11AM-5PM <br /> <br />Viens avec moi <br />Hours: Mon.: Closed <br /> Tue.-Sat.: 10AM-6PM <br /> Sun.: 12-5PM <br /> <br />Milk Shop <br />Hours: Mon.-Fri.: 10AM-8PM <br /> Sat & Sun: 10AM-6PM",
	"Mon.- Fri.: 9:30AM to 9PM <br /> Sat.: 9:30AM to 7PM <br /> Sun.: 11AM to 6PM",
	"All Books<br />Hours: Mon.-Fri.: 10AM-9PM<br />Sat.: 11AM-9PM<br />Sun.: 12PM-8PM<br /> <br />Black Squirrel Books & Espresso Bar<br />Hours: Mon.-Fri.: 8AM-9PM<br />Sat.: 9AM-9PM<br />Sun.: 9AM-7PM<br /> <br />The Book Bazaar<br />Hours: Mon.-Sat.: 10AM-6PM <br />Sun.: 1PM-5PM",
	"Mon.: Closed <br />Tue.-Fri.: 8:30AM-6PM <br />Sat.: 9AM-5PM <br />Sun.: 9AM-4PM",
	"Burgers n' Fries Forever <br />Everyday: 11AM-10PM<br /> <br />The Works<br />Varies with locations, but generally everyday: 11AM-10PM<br /><br />The King Eddy<br />Thu.-Sun.: open 24 hour<br />Mon.: 12AM-1AM, 7:30AM-1AM<br />Tue.: 7:30AM-1AM<br />Wed.: 7:30AM-12AM<br /><br />The Highlander Pub<br />Tue.-Sat.: 11AM-2AM<br />Sun.-Mon.: 11AM -1AM",
	"Mon.-Tue.: Closed<br />Wed.: 5PM-11PM<br />Thu.-Fri.: 5PM-2AM<br />Sat.-Sun.: 11AM-2AM",
	"Mon.: Closed<br />Tue.-Wed.: 12PM-2:30PM, 5:30PM-12AM<br />Thu.-Fri.: 12PM-2:30PM, 5:30PM-2AM<br />Sat.: 5:30PM-2AM<br />Sun.: 5:30PM-12AM",
	"Mon.-Fri.: 7AM-7PM<br />Sat.: 8AM-6PM<br />Sun.: 9AM-5PM",
	"Everyday: 2:45PM-2AM",
	"Mon.-Fri.: 8AM-8PM<br />Sat.-Sun.: 9AM-8PM",
	"The Tea Party Cafe<br />Hours: Sun.-Wed.: 10AM-6PM<br />Thurs.-Sat.: 10AM-9PM<br /><br />The Teastore<br />Hours: Sun.-Thu.: 9AM-7PM<br />Fri.-Sat.: 9AM-8PM<br /><br />Moscow Tea Room<br />Hours: Everyday: 4PM-2AM<br /><br />Nectar Fine Teas<br />Hours: Mon.-Wed.: 10AM-6PM<br />Thu.-Fri.: 10AM-7PM<br />Sat: 9AM-6PM<br />Sun: 10AM-5PM",
	"Mon.: Closed<br />Tue.-Sat.: 8AM-10PM<br />Sun.: 9AM-10 PM",
	"Open 24/7",
	"Mon.-Sat.: 11AM-1AM<br />Sun.: 12PM to 12AM",
	"Everyday: 12PM-9PM",
	"Open 24/7",
	"Everyday: 8PM-10PM",
	"Showtimes vary each day",
	"Check out his next show on his facebook: <a href='https://www.facebook.com/remi.royale' >Remi Royale Facebook</a>",
	"Every Saturday night at 9PM",
	"Archery Games<br />Mon.-Tue.: Closed<br />Wed.-Fri.: 4PM-11PM<br />Sat.-Sun.: 11AM-11PM<br /><br />BATL<br />Mon.-Sat.: 12-11PM<br />Sun.: 1-8PM<br /><br />Great Canadian Bungee<br />May-October<br />Mon.-Fri.: 10AM-6PM<br />Sat.-Sun.: 10AM-6PM<br />November-April<br />Mon.-Fri.: 9AM-5PM",
	"Mon.-Sat.: 11AM-1AM<br />Sun.: 12PM-12AM",
	"Times vary between 7-8PM nightly",
	"Sun.-Thu.: 11AM-1AM<br />Fri.-Sat.: 1AM-2AM",
	"Mon.-Tue.: 10AM-5PM<br />Wed.-Fri.: 10AM-9PM<br />Sat.-Sun.: 9:30AM-5:30PM",
	"Every Thursday: 7PM",
	"May 3rd-September 27 (2017)<br/>Wed.:12 (weather permitting)",
	"Check out the schedule at <a href='https://centretownmovies.wordpress.com/schedule/' >Dundonald Park Movies</a>",
	"Check the schedule at <a href='http://www.runottawa.ca/' >Run Ottawa</a>",
	"Check the schedule at <a href='https://www.nhl.com/senators/schedule/2017-04-01/ET' >Sens Game</a>",
	"For event times check the website: <a href='https://www.tdplace.ca/upcoming-events/' > TD Place</a>",
	"July 1st",
	"After hours on the last Friday of the month",
	"February 2nd-19 (2017)",
	"Escapade<br />June 24-25<br /><br />Cityfolk Festival <br />September 15-18<br /><br />RBC Royal Bank Bluesfest<br />July 6-16",
	"May 12-22",
	"August 31-September 4 (2017)",
	"June 22 - Sunday June 25 2017",
	"All year preferably fall, summer, spring, All day",
	"All year preferably fall, summer, spring, All day",
	"All year preferably fall, summer, spring, All day",
	"All year",
	"All year",
	"All year preferably fall, summer spring, All day",
	"All year",
	"Januaray 5th-March 4 (2018) (weather permitting, dates are approximate)",
	"Fri.: 8:30AM-5PM<br />Mon.-Thu.: 8:30AM-6PM<br />Sat.-Sun.: Closed",
	"All year",
	"Varying shows throughout the year",
	"Fri.-Wed.: 10AM-5PM<br />Thu.: 10AM-8PM"];
	location_leaf = ["Victoire Boutique<br />1282 Wellington St. W<br /><br />Viens Avec Moi<br />1338 Wellington St. W<br /><br />Milk Shop<br />45 William St.",
	"50 Rideau St.",
	"All Books<br />327 Rideau St.<br /><br />Black Squirrel Books & Espresso Bar<br />1073 Bank St.<br /><br />The Book Bazaar<br />417 Bank St.",
	"465 Parkdale Ave.",
	"Burgers n' Fries Forever<br />329 Bank St.<br /><br />The Works<br />580 Bank St., 2525 Bank St., 3500 Fallowfield Rd., 64 Stonehaven Dr., 363 St. Laurent Blvd.<br /><br />The King Eddy<br />45 Clarence St.<br /><br />The Highlander Pub<br />115 Rideau St.",
	"1077 Bank S.t",
	"380 Elgin St.",
	"969 Wellington St. W",
	"139 Preston St. #1",
	"1071 Bank St.",
	"The Tea Party Cafe<br />119 York St.<br /><br />The Teastore<br />53 York St.<br /><br />Moscow Tea Room<br />527 Sussex Dr.<br /><br />Nectar Fine Teas<br />1250 Wellington St. W",
	"1103 Bank St","969 Wellington St W","434 Preston St.","809 Bank St.","60 George St.",
	"354a Preston St.","1074 Bank St.",
	"Check out his next show on his facebook: <a href='https://www.facebook.com/remi.royale' >Remi Royale Facebook</a>",
	"651 Somerset St. W",
	"Archery Games<br />1860 Bank St. #3b<br /><br />BATL<br />2615 Lancaster Rd. #29<br /><br />Great Canadian Bungee<br />1780 Route 105, Chelsea, QC<br /><br />FoOBZ<br />Book at: 613-606-6066 or info@foobz.ca",
	"161 Middle St.","220 Rue Elgin S.t","14 Waller St.","1065 Bank St.","73 York St.","Wellington St.",
	"516 Somerset St. W","Check locations at <a href='https://www.runottawa.ca/' >Run Ottawa</a>","Canadian Tire Centre: 1000 Palladium Dr.",
	"1015 Bank St.","Wellington St.","240 McLeod St.",
	"Laurier Ave. W & Elgin St. at Confederation Park",
	"Escapade<br />4837 Albion Rd.<br /><br />Cityfolk Festival <br />Lansdowne Park<br /><br />RBC Royal Bank Bluesfest<br />Lebration Flats",
	"Various parks around Ottawa. We recommend you check out Mayor Hill's Park or Dow's Lake","Gatineau, Quebec",
	"Mooney's Bay Park, 2960 Riverside Dr.","Gatineau, Quebec","Near Hog's Back Park and Hog's Back Rd.","Tin House Ct.","Corkstown Bridge Bridge",
	"Glebe Ottawa","Ottawa","1 Rideau St.","Rideau Canal","Wellington St.","Ottawa","1 Elgin St.",
	"380 Sussex Dr."];
	price_leaf = ["Victoire Boutique: $$-$$$ <br />Viens Avec Moi: $$-$$$<br />Milk Shop: $-$$$","$-$$$","All Books: $<br />Black Squirrel Books & Espresso Bar: $-$$<br />The Book Bazaar: $","$$","Burgers n' Fries Forever: $$-$$$<br />The Works: $-$$<br />The King Eddy: $$ <br />The Highlander Pub: $$","$","$$","$$","$-$$","$-$$",
	"The Tea Party Cafe: $$<br />The Teastore: $-$$<br />Moscow Tea Room: $$<br />Nectar Fine Teas: $$","$","$","$$","$","$","$$","$","$","$$",
	"Archery Games: $$<Br />BATL: $$-$$$<br />Great Canadian Bungee: $$-$$$$","$","$","$-$$","$$-$$$","Bingo is free<br />Restaurant: $$","Free","Free","Free-$$","$$-$$$",
	"$$$","Free","$<br />Free on Thursday evenings","Free","$$-$$$","$-$$$, Free for children under the age of 12  downtown is filled with tulips - free to walk around","$$<br />Free for Kids for 10 and under","Free","Free","Free",
	"Free","Free","Free","Free, bike rental $-$$","$$$","Free","Free","$","$$-$$$, but there are discounts and promotions that you can find on <a href'https://nac-cna.ca/en/boxoffice/discounts'>NAC website</a>","$$"];
	media_leaf = ["<div class='mySlides fade'><img src='media/1/1_(1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(9).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(10).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(11).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(12).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(13).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(14).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(15).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(16).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(17).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(18).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/1/1_(19).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span><span class='dot' onclick='currentSlide(10)'></span><span class='dot' onclick='currentSlide(11)'></span><span class='dot' onclick='currentSlide(12)'></span><span class='dot' onclick='currentSlide(13)'></span><span class='dot' onclick='currentSlide(14)'></span><span class='dot' onclick='currentSlide(15)'></span><span class='dot' onclick='currentSlide(16)'></span><span class='dot' onclick='currentSlide(17)'></span><span class='dot' onclick='currentSlide(18)'></span><span class='dot' onclick='currentSlide(19)'></span>",
"<div class='mySlides fade'><img src='media/2/2_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/2/2_ (9).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span>",
"<div class='mySlides fade'><img src='media/3/3_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (9).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (10).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (11).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/3/3_ (12).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span><span class='dot' onclick='currentSlide(10)'></span><span class='dot' onclick='currentSlide(11)'></span><span class='dot' onclick='currentSlide(12)'></span>",
"<div class='mySlides fade'><img src='media/4/4_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/4/4_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/4/4_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/4/4_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/4/4_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/4/4_ (6).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span>",
"<div class='mySlides fade'><img src='media/5/5_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/5/5_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/5/5_ (3).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span>",
"<div class='mySlides fade'><img src='media/6/6_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/6/6_ (8).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span>",
"<img src='media/7/7_ (1).jpg' style='width:30%'>",
"<div class='mySlides fade'><img src='media/8/8_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (9).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/8/8_ (10).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span><span class='dot' onclick='currentSlide(10)'></span>",
"<div class='mySlides fade'><img src='media/9/9_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/9/9_ (7).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span>",
"<video width='30%' controls autoplay loop><source src='media/10/Wag.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
"<div class='mySlides fade'><img src='media/11/11_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (9).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (10).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (11).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (12).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (13).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (14).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (15).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (16).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (17).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/11/11_ (18).jpg' style='width:30%'></div><div class='mySlides fade'></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span><span class='dot' onclick='currentSlide(10)'></span><span class='dot' onclick='currentSlide(11)'></span><span class='dot' onclick='currentSlide(12)'></span><span class='dot' onclick='currentSlide(13)'></span><span class='dot' onclick='currentSlide(14)'></span><span class='dot' onclick='currentSlide(15)'></span><span class='dot' onclick='currentSlide(16)'></span><span class='dot' onclick='currentSlide(17)'></span><span class='dot' onclick='currentSlide(18)'></span>",
"<audio controls><source src='media/12/StellaLuna-audio.mp3' type='audio/mpeg'>Your browser does not support the audio element.</audio><br /><br /><div class='mySlides fade'><img src='media/12/12_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/12/12_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/12/12_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/12/12_ (4).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span>",
"<div class='mySlides fade'><img src='media/13/13_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/13/13_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/13/13_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/13/13_ (4).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span>",
"<div class='mySlides fade'><img src='media/14/14_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/14/14_ (2).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><br /><br /><video width='30%' controls autoplay loop><source src='media/14/14.mp4' type='video/mp4'>Your browser does not support the video tag.</video",
"<center><iframe src='https://www.instagram.com/p/BInhIbMD0jn/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<div class='mySlides fade'><img src='media/16/16_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/16/16_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/16/16_ (3).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span>",
"<video width='30%' controls autoplay loop><source src='media/17/Flapjacks-lowres.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
"<div class='mySlides fade'><img src='media/18/18_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/18/18_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/18/18_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/18/18_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/18/18_ (5).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span>",
"<center><iframe src='https://www.instagram.com/p/BAr3r0yGnYT/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<div class='mySlides fade'><img src='media/20/20_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/20/20_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/20/20_ (3).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span>",
"<div class='mySlides fade'><img src='media/21/21_ (1).png' style='width:30%'></div><div class='mySlides fade'><img src='media/21/21_ (2).png' style='width:30%'></div><div class='mySlides fade'><img src='media/21/21_ (3).png' style='width:30%'></div><div class='mySlides fade'><img src='media/21/21_ (4).png' style='width:30%'></div><div class='mySlides fade'><img src='media/21/21_ (5).png' style='width:30%'></div><div class='mySlides fade'><img src='media/21/21_ (6).png' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span>",
"<center><a data-flickr-embed='true' data-header='true' data-footer='true' data-context='true' data-vr='true'  href='https://www.flickr.com/photos/153282318@N08/32749699034/in/album-72157678770573413/' title='360_0165_Stitch_XHC'><img src='https://c1.staticflickr.com/4/3790/32749699034_7251ed394c_c.jpg' width='30%' alt='360_0165_Stitch_XHC'></a><script async src='//embedr.flickr.com/assets/client-code.js' charset='utf-8'></script><br /><h4 style='color: white;'>Click Here to see 360 degree slideshow</h4></center>",
"<div class='mySlides fade'><img src='media/23/23_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/23/23_ (2).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span>",
"<div class='mySlides fade'><img src='media/24/24_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/24/24_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/24/24_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/24/24_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/24/24_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/24/24_ (6).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span>",
"<div class='mySlides fade'><img src='media/25/25_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/25/25_ (7).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span>",
"<center><iframe src='https://www.instagram.com/p/BM7tiQLBJ-O/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<center><iframe src='https://www.instagram.com/p/BJgEzocjrAM/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<center><iframe src='https://www.instagram.com/p/6tgiBFtIOu/embed' width='400' height='480' frameborder='0' scrolling='no' allowtransparency='true'></iframe></center>",
"<video width='30%' controls autoplay loop><source src='media/29/Run-.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
"<video width='30%' controls autoplay loop><source src='media/30/sensgame.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
"<div class='mySlides fade'><img src='media/31/31_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/31/31_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/31/31_ (3).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span>",
"<center><iframe src='https://www.instagram.com/p/4j4tOOzPAg/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<center><iframe src='https://www.instagram.com/p/BQ7Or8zArzE/embed' width='400' height='480' scrolling='no' frameborder='0' allowtransparency='true'></iframe></center>",
"<div class='mySlides fade'><img src='media/34/34_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (6).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (7).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (8).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/34/34_ (9).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span>",
"<div class='mySlides fade'><img src='media/35/35_ (1).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (2).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (3).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (4).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (5).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (6).png' style='width:30%'></div><div class='mySlides fade'><img src='media/35/35_ (7).png' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span>",
"<img src='media/36/36.jpg' style='width:30%'>",
"<img src='media/37/37.jpeg' style='width:30%'>",
"<div class='mySlides fade'><img src='media/38/38_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/38/38_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/38/38_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/38/38_ (4).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span>",
"<div class='mySlides fade'><img src='media/39/39_ (1).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (2).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (3).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (4).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (5).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (6).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (7).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (8).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (9).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (10).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (11).png' style='width:30%'></div><div class='mySlides fade'><img src='media/39/39_ (12).png' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span><span class='dot' onclick='currentSlide(7)'></span><span class='dot' onclick='currentSlide(8)'></span><span class='dot' onclick='currentSlide(9)'></span><span class='dot' onclick='currentSlide(10)'></span><span class='dot' onclick='currentSlide(11)'></span>",
"<video width='30%' controls autoplay loop><source src='media/40/40.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
"<center><iframe src='https://www.instagram.com/p/BDta9Wjkdje/embed' width='400' height='480' frameborder='0' scrolling='no' allowtransparency='true'></iframe></center>",
"<div class='mySlides fade'><img src='media/42/42_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/42/42_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/42/42_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/42/42_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/42/42_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/42/42_ (6).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span>",
"<div class='mySlides fade'><img src='media/43/43_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/43/43_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/43/43_ (3).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span>",
"<center><iframe src='https://www.google.com/maps/d/embed?mid=1HTudlF4OHvILlpDMPmHw5yBnGIQ' width='640' height='480'></iframe><center>",
"<div class='mySlides fade'><img src='media/45/45_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/45/45_ (2).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span>",
"<img src='media/46/46.png' style='width:30%'>",
"<div class='mySlides fade'><img src='media/47/47_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/47/47_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/47/47_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/47/47_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/47/47_ (5).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span>",
"<img src='media/48/48.jpg' style='width:30%'>",
"<div class='mySlides fade'><img src='media/49/49_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/49/49_ (2).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span>",
"<div class='mySlides fade'><img src='media/50/50_ (1).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/50/50_ (2).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/50/50_ (3).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/50/50_ (4).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/50/50_ (5).jpg' style='width:30%'></div><div class='mySlides fade'><img src='media/50/50_ (6).jpg' style='width:30%'></div></div><br><div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span><span class='dot' onclick='currentSlide(4)'></span><span class='dot' onclick='currentSlide(5)'></span><span class='dot' onclick='currentSlide(6)'></span>"];
	}


function play() {
	setInterval( loop, 1000 / 40 );
}



//

function onDocumentMouseDown() {

	isMouseDown = true;
	return false;
}

function onDocumentMouseUp() {

	isMouseDown = false;
	return false;
}

function onDocumentMouseMove( event ) {

	mouse.x = event.clientX;
	mouse.y = event.clientY;
}



function onDocumentTouchStart( event ) {

	if( event.touches.length == 1 ) {

		event.preventDefault();

		// Faking double click for touch devices

		var now = new Date().getTime();

		if ( now - timeOfLastTouch  < 250 ) {

			//reset();
			return;
		}

		timeOfLastTouch = now;

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;

	}

}

function onDocumentTouchEnd( event ) {

	if ( event.touches.length == 0 ) {

		event.preventDefault();
		isMouseDown = false;

	}

}

function onWindowDeviceOrientation( event ) {

	if ( event.beta ) {

		gravity.x;
		gravity.y;

	}

}


function createLeaf( x, y ) {
	var size;
	var boundary;
	var x = stage[2]/2;
	var y = stage[3]/2;
	
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		size = 50;
		boundary = 20;
	}
	
	else {
		size = 100;
		boundary = 40;
	}
	//var size = 100;
	var element = document.createElement("canvas");

	//element.setAttribute("id", "leaf");
	//element.setAttribute("ondblclick", "openModal(this.attributes['name'].value)");
	element.setAttribute("ondblclick", "openModal(this.id)");
	element.setAttribute("id", "leaf_" + counter + "");

	element.width = size;
    element.height = size;
	element.style.position = 'absolute';
	element.style.WebkitTransform = 'translateZ(-3)';
	element.style.MozTransform = 'translateZ(-3)';
	element.style.OTransform = 'translateZ(-3)';
	element.style.msTransform = 'translateZ(-3)';
	element.style.transform = 'translateZ(-3)';
	element.style.filter = hueVal;
	element.setAttribute("onmouseover","hover(this.id)");
	element.setAttribute("onmouseout","hoverOut(this.id)");
	var graphics = element.getContext("2d");

	counter++;

	var img = new Image;
	img.src = "leaf3.png";
	img.onload = function(){
		graphics.drawImage(img, 0,0, size, size);
		
		
	};

	
	canvas.appendChild(element);
	elements.push( element );

	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = boundary;
	circle.density = density;
	circle.friction = friction;
	circle.restitution = restitution;

	b2body.AddShape(circle);
	b2body.userData = {element: element};

	b2body.position.Set( x, y );
	b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
	bodies.push( world.CreateBody(b2body) );
	
}

function openModal(thename) {
	//alert(thename);
  	var lightbox = document.getElementById('myModal');
	lightbox.style.textAlign = "center";
	//lightbox.style.fadeIn(1000);
  	//lightbox.style.display = "block";
  	var nameString = thename + "";
	var leafID = parseInt(nameString.slice(5));
	//alert(leafID);
	//var element_content = document.createElement("div");
	//element_content.style.color = "white";
	//element_content.style.textAlign = "center";
	var titleOfLeaf = document.getElementById('title');
	//titleOfLeaf = title_leaf[leafID];
	titleOfLeaf.innerHTML = title_leaf[leafID];
	var descriptionOfLeaf = document.getElementById('description');
	descriptionOfLeaf.innerHTML = description_leaf[leafID];
	var timeOfLeaf = document.getElementById('timehour');
	timeOfLeaf.innerHTML = time_leaf[leafID];
	var locationOfLeaf = document.getElementById('location');
	locationOfLeaf.innerHTML = location_leaf[leafID];
	var PricesOfLeaf = document.getElementById('prices');
	PricesOfLeaf.innerHTML = price_leaf[leafID];
	var mediaOfLeaf = document.getElementById('images_media');
	images_media.innerHTML = media_leaf[leafID];
	
	slideIndex = 1;
    showSlides(slideIndex);

}

function hover(thename) {

	//style='filter = 'drop-shadow(0px 0px 20px #4d0000);'
	 var nameString = thename + "";
	var leafID = parseInt(nameString.slice(5));
	var leaf = document.getElementById('leaf_' + leafID);
	//leaf.style.filter = 'drop-shadow(0px 0px 20px #4d0000);';
	leaf.style.filter = hueVal + " " + "drop-shadow(0px 0px 10px red)";
	//element.style.filter = 'hue-rotate('+ Math.random()*90 +'deg)';
	//alert(leafID);
}

function hoverOut(thename) {

	//style='filter = 'drop-shadow(0px 0px 20px #4d0000);'
	 var nameString = thename + "";
	var leafID = parseInt(nameString.slice(5));
	var leaf = document.getElementById('leaf_' + leafID);
	//leaf.style.filter = 'drop-shadow(0px 0px 20px #4d0000);';
	leaf.style.filter = hueVal;
	//alert(leafID);
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

function loop() {

	if (getBrowserDimensions()) {
		setWalls();
	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * 380 + delta[0];
	world.m_gravity.y = gravity.y * 380 + delta[1];

	mouseDrag();
	world.Step(timeStep, iterations);

	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];

		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';


			var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg) translateZ(0)';
            var style2 = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg)';
            element.style.webkitTransform = style2;

	}

}

function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {

		fixed = true;

	}

	var boxSd = new b2BoxDef();

	if (!fixed) {

		boxSd.density = 1.0;

	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);

}

function mouseDrag()
{
	// mouse press
	if (createMode) {

		//createBall( mouse.x, mouse.y );

	} else if (isMouseDown && !mouseJoint) {

		var body = getBodyAtMouse();

		if (body) {

			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouse.x, mouse.y);
			md.maxForce = 30000 * body.m_mass;
			// md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();

		} else {

			createMode = true;

		}

	}

	// mouse release
	if (!isMouseDown) {

		createMode = false;
		destroyMode = false;

		if (mouseJoint) {

			world.DestroyJoint(mouseJoint);
			mouseJoint = null;

		}

	}

	// mouse move
	if (mouseJoint) {

		var p2 = new b2Vec2(mouse.x, mouse.y);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {
	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {

		if (shapes[i].m_body.IsStatic() == false) {

			if ( shapes[i].TestPoint(mousePVec) ) {

				body = shapes[i].m_body;
				break;

			}

		}

	}

	return body;

}

function setWalls() {

	if (wallsSetted) {

		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);

		walls[0] = null;
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}

	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);

	wallsSetted = true;

}

// BROWSER DIMENSIONS

function getBrowserDimensions() {

	var changed = false;

	if (stage[0] != window.screenX) {

		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;

	}

	if (stage[1] != window.screenY) {

		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;

	}

	if (stage[2] != window.innerWidth) {

		stage[2] = window.innerWidth;
		changed = true;

	}

	if (stage[3] != window.innerHeight) {

		stage[3] = window.innerHeight;
		changed = true;

	}

	return changed;

}

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, td2, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
	td2 = tr[i].getElementsByTagName("td")[1];

    if (td || td2) {
      if ((td.innerHTML.toUpperCase().indexOf(filter) > -1) || (td2.innerHTML.toUpperCase().indexOf(filter) > -1)) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
	document.getElementById("mySidenav").style.boxShadow = "0px 0px 70px #000";
    //document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
   // document.getElementById("main").style.marginLeft= "0";
}
