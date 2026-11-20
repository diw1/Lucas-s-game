(() => {
  'use strict';

  // Each rectangle is centred on the named detail, in percentages of its original painting.
  const spot = (id, name, x, y, w, h, reply, effect, clue, marks = []) =>
    ({id, name, x, y, w, h, reply, effect, clue, marks});
  const treehouse = {
    canopy: {view:'Outside',to:'hollow',action:'Go inside',where:'wooden door',bounds:[46.5,54,9,28]},
    hollow: {view:'Inside',to:'canopy',action:'Go outside',where:'lower ladder',bounds:[63.4,65.3,12,22]}
  };
  const place = (id, name, size, description, stamp, neighbors, trails, spots) => ({
    id, name, description, stamp, neighbors, trails, spots, size, treehouse:treehouse[id],
    src: id === 'picnic' ? 'assets/original.jpg' : 'assets/places/' + id + '.webp'
  });

  window.LucasPlaces = [
    place('picnic', 'Orchard Picnic', [880, 1108],
      'The picnic blanket is ready, and there’s a spot for you under the tree. Who would you like to meet first?', 'Under the Apple Tree',
      ['canopy', 'reef'], {'canopy':'Follow the branches to the yellow treehouse.','reef':'Follow the blue edge of the blanket down to the sea.'}, [
        spot('cat','Picnic kitten',54.3,26.7,11,14,'The kitten closes its eyes and nudges its head into your hand.','purr','Look to the right of the tree trunk. Who’s wearing a yellow scarf?'),
        spot('bee','Bumblebees',13.7,33.4,14,10,'Bzzzz! A bee loops around your finger, then flies off to find a flower.','buzz','Two little guests in striped shirts are flying to the left of the tree.',[[13.4,40.3,11,7]]),
        spot('apple','Red apple',29.7,28.2,7.5,9,'You give the branch a gentle shake. A ripe red apple wobbles on its stem.','drop','Which red fruit hanging from a branch looks ready to pick?',[[17.6,24.8,5.7,7],[74.3,10.7,5.5,5.7]]),
        spot('fruit','Fruit basket',32.2,40.1,17,16,'You lift a leaf. There’s one more plump fruit tucked into the bottom of the basket!','rustle','Look for the woven baskets on the blanket.',[[24.7,50.2,17,12],[73,45,14,12]]),
        spot('cake','Layer cake',90.6,46.5,12,9,'A little fork cuts through the colourful layers. This slice is yours.','sprinkle','Find the treat wearing rainbow stripes on the right of the blanket.'),
        spot('flower','Apple blossom',65.1,20.1,8,7,'A breeze carries the scent of pink petals all the way to the picnic blanket.','petals','Look for pink blossoms among the branches.',[[6.1,21.5,6,7],[35.7,18.9,7,7],[53.9,2.9,7,5],[3.9,10.3,6,6],[88.6,7.3,8,8],[24.8,3.6,7,7]])
      ]),
    place('canopy', 'Forest Treehouse (Outside)', [788,788],
      'A koala hugs the trunk while a neighbour peeks over the balcony. The little wooden door leads inside.','Canopy Visitor',
      ['picnic','hollow'], {'picnic':'Climb down the tree. There’s still time for a picnic.','hollow':'Push open the wooden door beside the balcony.'},[
        spot('koala','Tree-hugging koala',27,89,26,20,'The koala changes its grip and gives you a wave with its free paw.','wave','Look for two round ears near the foot of the tree.'),
        spot('window','Round attic window',77,16,15,16,'Tap, tap. Two little echoes come back from the round window.','knock','There’s a window shaped like an eye in the triangular roof.'),
        spot('neighbor','Balcony neighbour',82,45,15,16,'Two little ears pop up over the railing. “Come and play again tomorrow!”','peek','Who’s waiting behind the railing on the right of the house?')
      ]),
    place('hollow','Forest Treehouse (Inside)',[888,888],
      'Little lights glow inside the yellow treehouse. The blue quilt is warm from the sun. The ladder downstairs leads back outside.','Treehouse Nightlight',
      ['canopy','bakery'], {'canopy':'Climb down the ladder to meet the koala outside.','bakery':'Smell fresh bread? Follow your nose to the rabbit baker.'},[
        spot('bed','Blue bed',59,26.5,22,15,'You pat the blue quilt. The mattress gives a little bounce. Someone’s going to sleep well tonight.','sleep','Look for a cosy patch of blue on the top floor.'),
        spot('squirrel','Acorn squirrel',10,83,20,24,'The squirrel hugs its acorn tighter. “I’m saving this one for winter!”','rustle','Who’s holding a tiny treasure by the roots on the left?'),
        spot('pig','Pink piglet',91.7,82,17,21,'The piglet wiggles its ears and hums a tune as it strolls along the roots.','hum','A little pink snout peeks out to the right of the trunk.')
      ]),
    place('bakery','Bunny Bakery',[940,940],
      'The bakery has just opened. Rabbit greets the customers, Cat tends the oven, and a blue balloon bobs by the door.','Fresh from the Oven',
      ['hollow','stage'], {'hollow':'Take a warm roll back to the little table in the treehouse.','stage':'Follow the music outside the bakery to the show.'},[
        spot('rabbit','Rabbit baker',32,52,24,26,'Rabbit wiggles those long ears and hands you a warm, round bread roll.','hop','Who’s that long-eared baker behind the counter?'),
        spot('baker','Cat baker',72,38,20,18,'Cat slides the tray towards you. “This batch is just right!”','steam','Look for a little chef’s hat on the right side of the counter.'),
        spot('balloon','Blue balloon',81,17,23,26,'The blue balloon bobs up and down. Its string gives a little wiggle too.','bob','What’s floating towards the ceiling in the top right corner?')
      ]),
    place('stage','Starlight Stage',[1072,858],
      'The curtain is up. The pink singer is ready, the lights are in place, and a tiny fan is waiting in the grass.','Starlight Applause',
      ['bakery','castle'], {'bakery':'Pop into the bakery for a snack between songs.','castle':'When the lights go down, follow the bats to the castle.'},[
        spot('singer','Pink singer',51.5,47.4,37,42,'“La, la, laaa!” The last note rolls right off the stage and into the grass.','song','Who’s sitting in the middle of the stage?'),
        spot('lamp','Mushroom lamp',94,41,12,29,'The mushroom lamp lights up and shines a spotlight on the singer.','glow','A lamp with a red, spotty cap stands to the right of the stage.'),
        spot('snail','Snail in the audience',64,84,13,16,'The snail inches forward with its spiral house. Now it has a front-row seat.','trail','Look for a little spiral in the grass below the stage.')
      ]),
    place('castle','Pumpkin Castle',[1040,838],
      'Castle windows glow against a golden sky. Look above the rooftops and down by the door to see who’s visiting.','Pumpkin Moon',
      ['stage','cat'], {'stage':'Follow the flutter of wings back to the stage.','cat':'Walk through the archway and look for blue eyes in the garden.'},[
        spot('bat','Little black bat',17,24,18,17,'The bat stretches its wings and banks quietly around a tower.','flutter','Look up for a pair of little black wings.'),
        spot('gate','Castle gate',40,72,16,24,'Knock, knock. A little ghost knocks twice from the other side. That’s tonight’s secret code!','knock','There’s an archway below the tallest tower.'),
        spot('pumpkin','Pumpkin lantern',91,18,17,23,'The pumpkin winks at you and flashes a big, crooked grin.','glow','Which orange face in the top right has the widest smile?')
      ]),
    place('cat','Kitten Garden',[686,686],
      'The garden kitten sits perfectly still. Come closer to see the flower by its ear and the sparkle in its blue eyes.','Blue-Eyed Paw Print',
      ['castle','parade'], {'castle':'Take the garden path back to the castle gate.','parade':'Walk around the flower beds and follow the ribbons to the parade.'},[
        spot('blossom','Blue flower',35,28,14,13,'The blue flower trembles. The kitten decides to let it perch there a little longer.','petals','There’s a tiny blue flower near the ear on the left.'),
        spot('eye','Lake-blue eyes',62,38,21,15,'The kitten blinks at you. A tiny star glints in its blue eyes.','twinkle','Look for two eyes as blue as little lakes.',[[33,39,18,14]]),
        spot('nose','Pink nose',44,60,15,12,'The kitten twitches its nose. “I can smell your picnic!”','purr','Follow the long whiskers to the spot where they meet.')
      ]),
    place('parade','Ribbon Parade',[684,504],
      'Flags flutter overhead and trophies gleam on both sides. There’s room at today’s parade for everyone who steps into the painting.','Ribbon Champion',
      ['cat','reef'], {'cat':'Follow the ribbons in the grass back to the kitten’s garden.','reef':'Hop aboard the parade boat and sail to Coral Cove.'},[
        spot('cup','Champion’s cup',23,28,16,24,'Ting! A speck of golden light skips off the rim of the cup.','chime','Look on the left for the big cup with a number 1.'),
        spot('guest','Pink parade star',53,38,27,35,'The round pink guest sways under the flags. Everyone starts clapping along.','confetti','Who is the roundest guest under the flags?'),
        spot('prize','Star trophy',76,23,16,36,'You tap the trophy. The star on top gleams as if it’s just been polished.','twinkle','What’s sparkling on top of the prize on the right?')
      ]),
    place('reef','Coral Cove',[674,472],
      'Bubbles rise through the water. A blue whale and a sea turtle swim overhead, and someone is scuttling sideways across the sand.','Coral Tide',
      ['parade','picnic'], {'parade':'Follow the flags along the water back to the parade.','picnic':'Pad across the sand and join the picnic under the tree.'},[
        spot('whale','Blue whale',22,14,34,25,'The blue whale swishes its tail. A string of bright bubbles rises above its nose.','bubbles','Who has a big tail in the top left corner of the painting?'),
        spot('turtle','Sea turtle',49,12,22,23,'The turtle kicks its flippers and carries its patterned shell towards the next patch of coral.','swim','Look near the surface for a patterned shield that swims.'),
        spot('crab','Red crab',67,71,30,24,'The red crab raises both claws and sidesteps twice, leaving a trail of tiny footprints in the sand.','scuttle','Who’s holding up two red claws on the sandy bottom?')
      ])
  ];
})();
