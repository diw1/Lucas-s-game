/* Starfall Atlas · Companion field investigations. */
(() => {
  "use strict";
  const pair=(zh,en)=>[zh,en];
  const site=(x,y,nameZh,nameEn,zh,en)=>({x,y,name:pair(nameZh,nameEn),note:pair(zh,en)});
  const plan=(nameZh,nameEn,zh,en)=>({name:pair(nameZh,nameEn),feedback:pair(zh,en)});
  const cases=[
    {
      title:pair("谁把种子送到这里？","Who delivered the seeds?"),stamp:pair("溪流邮差","Creek Post"),
      intro:pair("栗尾想收集今晚漂来的枫树种子。昨天刮了风，今天却一丝风也没有。把接种篮放在哪里最好？","Pip wants to catch the next delivery of maple seeds. Yesterday was windy, but today the woods are perfectly still. Where should the basket go?"),
      alt:pair("阳光下的小溪。左岸有松果，水中漂着有翅的种子，右边的树枝拦住了一堆。","A sunlit creek. A cone rests on the left bank, winged seeds float midstream, and twigs hold a cluster on the right."),
      sites:[
        site(16,50,"张开的松果","Open cone","鳞片里夹着小小的松子。溪边那堆种子却有又长又扁的翅。","Tiny pine seeds sit between the scales. The seeds beside the creek have long, flat wings."),
        site(44,50,"水面上的种子","Floating seeds","你盯着一颗漂浮的种子数到五。它顺着水纹靠近下游的枝堆，翅膀始终湿着。","You count to five while watching one seed. It drifts with the ripples towards the twigs downstream, its wing wet the whole way."),
        site(76,20,"倒木上的菌伞","Log shelf","倒木离水面有两只爪子高。上面有干叶子，菌伞下连一颗枫树种子也没有。","The log stands two paws above the water. There are dry leaves on it and no maple seeds under its mushrooms."),
        site(85,67,"卡在枝间的种子","Twig trap","小树枝像梳子一样横过水面。潮湿的种子全堆在上游那一侧，下游只有清水。","Small twigs form a comb across the current. Wet seeds gather on the upstream side. Only clear water flows beyond it.")
      ], keeper:pair("栗尾","Pip"),
      witness:pair("“昨晚风把种子从树上吹下来了。今天早上我晒着尾巴，胡须都没动，一颗种子却从我脚边漂了过去。”","“The wind shook seeds from the tree last night. This morning my whiskers didn't move, but a seed drifted right past my paws.”"),
      question:pair("今天将篮子放在哪里？","Where should the basket sit today?"),
      plans:[
        plan("挂在倒木高处接风","Hang it high on the log","昨天的风能把种子吹落，可今天它们还在移动。找找正在推着种子的东西。","Yesterday's wind could shake seeds loose. What keeps them moving through the still air today?"),
        plan("放在下游枝堆的迎水面","Nestle it upstream of the twig trap","",""),
        plan("放在松果正下方","Set it beneath the pine cone","比较松果里的松子和水面上种子的形状。篮子要接的是枫树种子。","Compare the seeds inside the cone with the winged ones on the water. Pip is collecting maple seeds.")
      ], answer:1, proof:[1,3],
      need:pair("一条记录要说明谁在运送种子，另一条要说明种子在哪里停下。","Pair a record of what carries the seeds with one showing where they stop."),
      ending:pair("栗尾把小篮子别在树枝上。第一颗枫树种子绕着篮沿转了一圈，正好落进去。它给这条水路取名叫“溪流邮局”。","Pip hooks the little basket onto a twig. The first seed circles its rim and drops neatly inside. Pip names this route the Creek Post.")
    },{
      title:pair("小鱼的退潮路线","An ebb-tide escape"),stamp:pair("潮池领航员","Tidepool Pilot"),
      intro:pair("潮水快退了。泡芙要带最后一群小鱼离开潮池，路线现在就得够深，而且不能有落差。","The tide is falling. Ripple needs a way out for the last school of fish. It must be deep enough now, with no drop on the way to the sea."),
      alt:pair("蓝色潮池里有小鱼，左边是半入水的石拱，右边一道浅水沟通向海边，上面有高岩台。","Silver fish circle a blue pool. A half-submerged arch opens on the left, while a small rill cuts the sand below a high shelf on the right."),
      sites:[
        site(19,42,"石拱下的水","Arch passage","泡芙把带结的测绳从拱洞一路拉向海。整条绳都泡在水里，最浅处还能淹过三排绳结。","Ripple draws a knotted line through the arch to the sea. It stays submerged the whole way, at least three knots deep."),
        site(41,69,"银色鱼群","Silver school","一条鱼从泡芙爪边擦过。它的身体比测绳上的两个绳结略窄。","A fish brushes Ripple's paw. Its body is just narrower than two knots on the measuring line."),
        site(82,62,"沙地小沟","Sandy runnel","细沟在池边跌下一级石阶。阶顶的水只淹过半个绳结，越往海边越浅。","The rill drops over a stone at the pool edge. Water above the step covers only half a knot and gets shallower seaward."),
        site(87,18,"高岩台","High shelf","岩台有一道昨天的潮线。今晚的水面还在岩台下方很远的地方。","Yesterday's wrack line marks the ledge, far above tonight's water.")
      ],keeper:pair("泡芙","Ripple"),
      witness:pair("“它们过不了干石头，水也得有两个绳结深。我刚做了记号，今晚水位已经开始下降了。”","“They need two knots of water and can't cross bare stone. I marked the tide twice. It has already started falling.”"),
      question:pair("带鱼群走哪条路线？","Which route should the school follow?"),
      plans:[
        plan("现在穿过石拱","Swim through the arch now","",""),
        plan("顺着沙沟冲下去","Send them down the sandy rill","沟里的水看起来在流。看看石阶顶部还剩多深，再和鱼需要的深度比一比。","The rill does flow. Compare its depth above the stone step with what a fish needs."),
        plan("等水漫过高岩台","Wait for the high shelf to flood","泡芙标出的水位正往下降。等下去，高岩台只会离水更远。","Ripple's marks show the water is falling. Waiting will leave the shelf even higher above it.")
      ],answer:0,proof:[0,2],
      need:pair("泡芙给了最低水深。把两条现成水道各自最浅处的记录一起交给它。","Ripple supplied the minimum depth. Compare the shallowest point of the two existing waterways."),
      ending:pair("泡芙游在最前面，银鱼一条接一条穿过拱洞。等最后一条小尾巴消失，沙沟顶上已经露出了一块干石头。","Ripple leads a silver procession through the arch. As the last tail disappears, the first dry stone shows in the sandy rill.")
    },{
      title:pair("没有人敲的双音钟","The two-note mystery"),stamp:pair("峡谷听音员","Canyon Listener"),
      intro:pair("峡谷总在山风过后传出“叮、当”两声。值夜的铜铃想知道是哪里响了，好让大家安心睡觉。","Two notes ring out after each mountain gust. Clink is keeping watch and wants to tell the sleepers exactly where the sound comes from."),
      alt:pair("峡谷吊桥前，左边一口大钟，右边两只小风铃，红色旗带朝左飞扬，瀑布落在桥下。","A large bell hangs on the left of a rope bridge. Two chimes hang to its right under a red streamer. A waterfall drops below."),
      sites:[
        site(15,53,"独钟的舌头","Great bell","铜铃轻敲它一下，只听见低沉的一个音。钟舌的绳扣很紧，刚才那阵风没让它动。","Clink taps it once and hears one low note. The clapper cord is snug. It stayed still in the last gust."),
        site(64,15,"红色风带","Red streamer","风带一绷紧，下方两片金属叶就一起向左摇。风带落下来时，峡谷也渐渐安静。","As the streamer pulls taut, two metal leaves below swing left together. When it droops the canyon quietens."),
        site(52,69,"桥下水声","Waterfall","你捂住一只耳朵听了好一会儿。瀑布从头到尾都在轰鸣，没有停顿。","You cover one ear and listen. The waterfall makes a continuous rush without a pause."),
        site(81,59,"一对短风铃","Twin chimes","左筒比右筒长。铜铃分别拨动两片叶子，你听到的正是先低后高的那一对音。","The left tube is longer. Clink nudges the leaves one by one. You hear the familiar low note followed by the high one.")
      ],keeper:pair("铜铃","Clink"),
      witness:pair("“我闭上眼也能分出两个音高。先是低音，后是高音。每次旗子绷紧，我数到一，声音就来了。”","“I can hear two pitches with my eyes shut. Low, then high. Every time the flag pulls taut I count one, and there they are.”"),
      question:pair("在值夜簿里记下哪一种解释？","What explains both the sound and its timing?"),
      plans:[
        plan("瀑布声每隔一会儿撞上石壁","A waterfall echo arrives in pairs","水声一直没有停。是什么只在旗子绷紧时才开始晃？","The waterfall never pauses. What starts swinging only when the streamer straightens?"),
        plan("大钟在两边岩壁间回响","The great bell echoes off both cliffs","同一个钟声的回音会越来越轻。铜铃听到的两声却有不同的音高。","An echo could repeat the big bell more softly. Clink heard two different pitches."),
        plan("阵风带动了两只不同音高的小铃","Gusts move the two different chimes","","")
      ],answer:2,proof:[1,3],
      need:pair("需要一次能重现双音的试听，还需要一处能解释它何时响起的观察。","Find a sound test that reproduces the two pitches and an observation that explains when they ring."),
      ending:pair("铜铃在值夜簿上画了两枚晃动的叶子。第二阵风吹来时，山羊们在第一声里闭眼，在第二声里睡着了。","Clink draws two swinging leaves in the watch book. At the next gust the goats close their eyes on the first note and fall asleep on the second.")
    },{
      title:pair("雨夜的干燥卧室","A dry room for rain"),stamp:pair("晶洞回声师","Echo Scout"),
      intro:pair("今晚会下大雨。紫翼想找一个有空腔、雨水也够不着的地方睡觉。山洞里有三处地方看起来都合适。","Heavy rain is coming. Vesper needs a hollow to sleep in above the highest rainwater. Three places look promising from the cave mouth."),
      alt:pair("左侧是明亮的紫晶柱，中央高处有带石阶的窄缝，右下的矮洞旁就是水池与瀑布。","Pale crystal glows on the left. A narrow stepped crack lies high in the middle; a low arch opens beside a pool and waterfall to the right."),
      sites:[
        site(20,51,"发光的晶柱","Bright crystal","你轻敲晶柱。里面只回了一声清脆的“当”，发光的部分和基座连成一整块。","You tap the crystal. It rings cleanly just once; the glowing face is one solid piece down to its base."),
        site(55,28,"高处的窄缝","Upper crack","紫翼朝窄缝轻叫。里面传来两次回响，翅尖上的绒毛被从里吹出的干风拨了一下。","Vesper chirps into the upper crack. Two echoes return. A dry draft from inside stirs the fuzz on one wingtip."),
        site(85,66,"水边矮洞","Lower arch","矮洞也回了两声。洞门很宽，就在池边，入口旁的石头还沾着湿泥。","The low arch also echoes twice. Its wide doorway stands beside the pool, with wet mud on the sill."),
        site(66,82,"池壁的雨痕","Rain line","上次暴雨留下的泥线越过矮洞顶，却只到高处石阶的一半。两处洞口在泥线的两边。","Mud from the last storm runs above the low arch but stops halfway up the steps. The two openings lie on opposite sides of the line.")
      ],keeper:pair("紫翼","Vesper"),witness:pair("“实心晶石响一下，后面藏着空腔就响两下。我睡着后会松开翅膀，洞里可不能进水。”","“Solid crystal rings once. A hollow beyond it answers twice. When I sleep my wings relax, so the chamber must stay dry.”"),
      question:pair("把紫翼的小窝挂到哪里？","Where should Vesper hang the little roost?"),
      plans:[
        plan("靠近发光晶柱的中心","In the bright crystal","透亮的表面看上去像个窗户，但它的回声能证明里面有房间吗？","Its bright face looks like a window. Did its echo reveal a chamber?"),
        plan("石阶尽头的高处窄缝","In the upper crack above the steps","",""),
        plan("水池边宽敞的矮洞","Inside the wide lower arch","矮洞的确是空的。再看上次暴雨留下的水位。","The lower arch is hollow. Check how high the last storm rose.")
      ],answer:1,proof:[1,3],
      need:pair("一条记录要证明新卧室是空的，另一条要证明雨水够不着它。","One record must show the new room is hollow and another must show it is above the flood."),
      ending:pair("雨点落进池面时，紫翼已经把翅膀叠成了被子。你听见窄缝里传来两声细小的呼噜。","By the time rain dimples the pool, Vesper's wings are folded into a blanket. Two tiny snores echo out of the upper crack.")
    },{
      title:pair("月光下的送粉客","The moonlight courier"),stamp:pair("兰花追踪者","Orchid Tracker"),
      intro:pair("芽芽想在树冠之间补种花盆，让夜间的送粉客一路有花可访。今晚的飞蛾究竟正在替哪种花送粉？","Frond wants to bridge a gap in the canopy with planters for tonight's pollen courier. Which flower is the visiting moth actually serving?"),
      alt:pair("月光洒在一只银色飞蛾上，左边白花长着金黄色花药，右边的紫花像小喇叭，枝头还有花苞。","Moonlight catches a silver moth. The white flowers on the left have golden anthers. Purple trumpets grow to the right, with buds overhead."),
      sites:[
        site(24,52,"白花的花药","White anthers","你把白花花药轻碰在黑纸上，留下一排淡金色的细粉，像半弯的小月牙。","The white orchid's anther leaves pale gold powder on black paper, arranged like a little crescent."),
        site(84,62,"紫花的花心","Purple throat","花喉很宽，访客当然能进去。可紫花留下的是一团深橘色粉点。","Its throat is wide enough for a visitor. On a paper sample the purple flower leaves a round blot of deep orange."),
        site(64,32,"飞蛾的胸毛","Moth's fur","飞蛾停在叶尖。你用放大镜看到，它胸口有两道淡金色的月牙，旁边的翅膀却是干净的。","When the moth rests, your lens reveals two pale gold crescents on its chest. The nearby wing is clean."),
        site(43,27,"未开的花苞","Closed bud","花苞的外皮还紧紧包着花瓣，里面的花粉只好再等一晚。","The green skin still clasps the petals tightly. The pollen inside will have to wait another night.")
      ],keeper:pair("芽芽","Frond"),witness:pair("“我看见它在两种花旁边都飞过。飞过可不一定送到了花粉。你可以比较它身上的印子和花留下的样本。”","“I saw the moth fly near both flowers. Passing by doesn't deliver pollen. Compare the marks on the visitor with a sample from a flower.”"),
      question:pair("这条夜间送粉路应该补种什么？","What will complete this courier's night route?"),
      plans:[
        plan("开着的白星兰","Open white star orchids","",""),
        plan("开着的紫喇叭兰","Open purple trumpet orchids","紫花也开着，但它的花粉印和飞蛾胸前的印子颜色、形状都一样吗？","The purple flowers are open too. Do their marks match the colour and shape on the moth?"),
        plan("只摆还没开的花苞","Only unopened buds","未来的花能帮到另一个夜晚。今晚的访客现在需要碰到花粉。","Future flowers may help on another night. Tonight's visitor needs pollen it can reach now.")
      ],answer:0,proof:[0,2],
      need:pair("把飞蛾实际带着的印子，和留下相同印子的一种花配在一起。","Pair a sample from the actual visitor with the flower that leaves the matching mark."),
      ending:pair("芽芽把花盆摆成一条银白色的小路。飞蛾回来时，你隔着三片树叶也能认出它胸前那一弯浅金色。","Frond sets out a little road of white blooms. When the moth returns you recognise its golden crescent from three leaves away.")
    },{
      title:pair("不烫也不冲走的育婴池","The quiet nursery"),stamp:pair("温泉守护员","Warmwater Warden"),
      intro:pair("炭团要给火冠蝾螈的卵找新家。卵需要温水和安静的石边。你带来了三枚会随温度变形的蜡珠。","Ember is choosing a nursery for cinder-newt eggs. They need warm water and a quiet stone edge. You bring wax beads that change shape with heat."),
      alt:pair("左边的黑岩裂口冒着橙光，中间是一圈红石围出的温泉，右边溪水从岩石间快速流过。","An orange fissure glows on the left. Rust-red stones circle a pool in the middle, with rushing water beyond the rocks to the right."),
      sites:[
        site(12,37,"裂缝边的黑岩","Fissure rock","靠近裂缝的蜡珠一下子摊成了小饼，那里的水几乎烫得直冒泡。","The bead at the fissure flattens into a puddle. Water beside the black rock is hot enough to bubble."),
        site(80,63,"山溪急流","Cold cascade","蜡珠还是硬球。你用小绳拴好试温叶，一放手，它就被水猛地扯走。","The bead stays hard. The test leaf is tied to a thread, and the stream tugs it away as soon as you let go."),
        site(48,56,"池心试温石","Pool test stone","围石池里的蜡珠边缘变圆了。等到沙漏滴完，它还保持着小珠子的形状。","The bead at the stone-ringed pool softens around its edges. A whole sandglass later it still holds its shape."),
        site(65,67,"石圈的内沿","Inside the stone ring","炭团把一片小叶子贴在内沿。急流从石圈外绕过去，叶子一直轻轻浮在原地。","Ember sets a little leaf at the inner rim. The rushing water passes outside the ring; the leaf floats gently in place.")
      ],keeper:pair("炭团","Ember"),witness:pair("“合适的水能让蜡珠变软，不能把它化平。卵比叶子还轻，溪流一冲就会离开育婴石。”","“Nursery water should soften a wax bead without flattening it. Our eggs are lighter than leaves. A current would pull them from the nursery stone.”"),
      question:pair("哪一处能同时通过两项测试？","Which spot passes both nursery tests?"),
      plans:[
        plan("紧挨发光裂缝","Beside the glowing fissure","这里的温度测试让蜡珠完全摊平了。它超过了炭团说的温度范围。","The wax flattened completely beside the fissure. That exceeds Ember's temperature range."),
        plan("右边溪流的正中央","Midstream in the cascade","可以顺着溪流一路游走，可卵需要留在石边。观察试温叶放开后的动作。","The current makes a fine ride, but the eggs need to stay put. Check the test leaf."),
        plan("红石圈内侧的浅水","Inside the rust-red stone ring","","")
      ],answer:2,proof:[2,3],
      need:pair("给新育婴池配上一份温度记录，再配上一份同一处的水流记录。","Supply a temperature test and a current test from the same proposed nursery."),
      ending:pair("炭团把卵串轻轻绕在内侧的石头上。第二天早晨，每一枚都还在原位，里面多了逗号似的小尾巴。","Ember winds the egg string around the sheltered stone. Next morning every egg is still there, each with a tiny comma-shaped tail inside.")
    },{
      title:pair("雪地里的最后一行脚印","The last line of tracks"),stamp:pair("雪踪侦察员","Snowtrail Scout"),
      intro:pair("一只小雪貂去了哪里？雪地上留下了翼印、脚印和一根空心树干。雪羽想在它躲风的地方留一颗干果。","Where did the little snow stoat shelter? There are wing marks, paw prints and a hollow log. Rime wants to leave a dried berry at the right doorstep."),
      alt:pair("极光下的雪地左侧有大型翼印，中央一串小脚印通往右边的空心倒木，左后方有松树。","A broad wing impression lies in the snow on the left. Small prints run towards the hollow log on the right. A dark pine stands behind them."),
      sites:[
        site(23,73,"雪面翼印","Wing impression","雪羽的翼印很宽。几枚小脚印压在它翅尖推起的薄雪上面，小雪貂走得更晚。","A few paw prints press into a ridge left by Rime's wingtip. The stoat stepped there after the wing touched down."),
        site(63,71,"成串的小爪印","Paw trail","你用细线连起脚印。相同大小的小爪印一步没断地朝空心树干走去，趾尖都朝向树洞。","You follow the same-sized prints without a break. Every small toe points towards the hollow log."),
        site(73,46,"树洞门口","Log doorway","最后一对爪印压在洞内的雪上。门口的另一边还铺着平雪，没有出去的脚印。","The last pair presses into snow inside the hollow. The far edge still has smooth snow with no tracks coming out."),
        site(14,28,"远处的松树","Far pine","松树能挡风。可树根四周只有松针扎出的小点，没有那种成对的爪印。","The pine could block the wind. Around its roots you find only needle pinpricks, with no paired paw marks.")
      ],keeper:pair("雪羽","Rime"),witness:pair("“昨晚我落在雪地上理了一会儿羽毛，后来独自飞走了。谁在我走后经过，你要看印子谁压着谁。”","“I landed to tidy my feathers last night and flew away alone. To tell who came later, look at which marks press into the others.”"),
      question:pair("把干果放在哪里等它发现？","Where will the stoat find the berry?"),
      plans:[
        plan("远处松树的树根下","Under the far pine","一个看起来舒服的地方，还需要有这只小动物实际去过的痕迹。","A promising shelter still needs a trace showing this animal actually went there."),
        plan("空心倒木的入口边","At the doorway of the hollow log","",""),
        plan("最宽的翼印中央","In the centre of the wing mark","翼印属于雪羽。爪印压在翼印上，说明小雪貂在那之后还在自己走路。","That mark belongs to Rime. Prints on top of it show the stoat was still walking afterwards.")
      ],answer:1,proof:[1,2],
      need:pair("一份记录要给出脚印前进的方向，另一份要说明它进了哪里、有没有再出来。","Show the direction of travel, then where the trail entered and whether it came back out."),
      ending:pair("干果在树洞口滚了半圈就停了。一个黑鼻尖探出来，轻轻把果子叼走了。雪羽悄悄合上了手记。","The berry rolls half a turn at the doorway. A dark nose peeks out and a small mouth draws it inside. Rime quietly closes the notebook.")
    },{
      title:pair("倒过来的三颗星","Three stars upside down"),stamp:pair("黎明星测师","Dawn Navigator"),
      intro:pair("曜曜要给今晚的航道刻上三角星标。水盘和天空里的图案上下相反，旧铜仪又停在昨夜的位置。航标朝哪边才对？","Sol needs to set a triangular guide for tonight's skyway. The basin and the sky show opposite triangles, and the old orrery stopped last night. Which way should the guide point?"),
      alt:pair("黎明的山顶，左侧有一面铜镜，中间立着旧铜制天体仪，右上方三颗星的倒影出现在右下的静水盘里。","At dawn a tilted dish stands left of an old brass orrery. Three stars shine in the upper right and reflect in a still-water basin below."),
      sites:[
        site(12,54,"雾边铜镜","Fog-bound dish","镜面泛着日出的金光，附近横着一层低云。你换了三个角度，仍然看不到完整的三颗星。","The dish shines with dawn gold and a bank of cloud. Even from three angles it never shows all three stars."),
        site(46,32,"停转的天体仪","Stopped orrery","铜轮的止动扣还扣着，刻针停在昨天的沟槽里。金属小球的位置没有随今夜的星空移动。","The brake latch is still fastened. Its pin rests in yesterday's groove; the brass balls haven't followed tonight's sky."),
        site(84,14,"真正的三星","The actual stars","你把手指举平当作地平线。两颗星较低，第三颗独自在它们上方，画成一个朝上的尖。","With your finger held level to the horizon you see a low pair, with a single star above them. The point faces up."),
        site(84,73,"静水盘倒影","Still basin","倒影里有三颗一样间距的星，独星却在那一对的下方。池面越平，这个上下颠倒的图案就越清楚。","The three reflections have matching spacing, but the single star is below the pair. The stiller the surface, the clearer the upside-down pattern.")
      ],keeper:pair("曜曜","Sol"),witness:pair("“幼鲸从云上看航标，方向要和真正的天空一样。水能帮我们认出同一组三星，可水会把上下翻转。”","“The calf reads the guide from the clouds, in the same orientation as the real sky. Water helps recognise the group, but flips top and bottom.”"),
      question:pair("把独星刻在航标的哪一边？","How should the single star be set on the guide?"),
      plans:[
        plan("独星在上，与真正的天空同向","Single star above, aligned with the sky","",""),
        plan("独星在下，照着水盘原样刻","Single star below, copying the water","水盘是倒影。可以借它核对是哪三颗星，还要把上下方向翻回来。","The basin gives a reflection. Use it to identify the three stars, then reverse its vertical orientation."),
        plan("照旧铜仪的位置直接刻","Copy the old brass model","铜轮的止动扣还在。昨晚的模型不能替你测量今天黎明前的天空。","The brake is fastened. Yesterday's model cannot measure today's predawn sky.")
      ],answer:0,proof:[2,3],
      need:pair("曜曜需要核对同一组星。找出一次直接观测，以及一次能说明为什么图案翻转的对照。","Identify the same group twice: a direct observation and a comparison that explains the flipped pattern."),
      ending:pair("曜曜把航标转到位。幼鲸从云间探头，对着独星在上的三角轻轻唱了一声。八座岛的调查笔记里，又多了一盏真正会指路的小灯。","Sol turns the guide into place. The calf peeks from the clouds and sings to the upward triangle. The islands' field journal has gained a small light that really can show the way.")
    }
  ];
  const element=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const letter=i=>String.fromCharCode(65+i);
  function mount(host,{region=0,lang="zh",saved,onSave=()=>{},onWin=()=>{},sound=()=>{},placeTrace}={}) {
    region=Number.isInteger(region)&&region>=0&&region<cases.length?region:0;
    const file=cases[region],zh=lang==="zh",l=zh?0:1,w=(cn,en)=>zh?cn:en, loc=a=>a[l];
    const picture="art/field-"+(region+1)+".webp",portrait="art/keeper-"+(region+1)+".webp";
    const root=element("section","sff"); host.replaceChildren(root);
    const source=saved?.v===1&&saved.region===region?saved:{};
    const entries=a=>Array.isArray(a)?[...new Set(a.filter(i=>Number.isInteger(i)&&i>=0&&i<4))]:[];
    const seen=entries(source.seen),pinned=entries(source.pinned).filter(i=>seen.includes(i)).slice(0,2);
    let talked=source.talked===true, focus=source.focus===4&&talked?4:seen.includes(source.focus)?source.focus:-1;
    let choice=Number.isInteger(source.choice)&&source.choice>=0&&source.choice<3?source.choice:-1;
    const ready=()=>seen.length>=2&&talked;
    const proven=()=>choice===file.answer&&file.proof.every(i=>pinned.includes(i));
    let stage=source.stage==="ending"&&ready()&&proven()?"ending":source.stage==="report"&&ready()?"report":"survey";
    let reply="",claimed=false;
    const save=()=>onSave({v:1,region,stage,seen:seen.slice(),talked,focus,choice,pinned:pinned.slice()});
    function button(id, cls, label, n) {
      const b=element("button",cls,label); b.type="button"; b.dataset.sfaction=id;
      if(n!==undefined)b.dataset.sfn=n;
      return b;
    }
    function pic(path,alt,cls) {const img=element("img",cls);img.src=path;img.alt=alt;img.draggable=false;return img;}
    function head() {
      const line=element("header","sff-head"), kicker=element("div","sff-eyeline");
      kicker.append(element("span","sff-rule"),element("span","",stage==="survey"?w("伙伴调查","FIELD INVESTIGATION"):stage==="report"?w("调查报告","FIELD REPORT"):w("调查结案","CASE RESOLVED")));
      line.append(kicker,element("h3","sff-title",loc(file.title)),element("p","sff-intro",stage==="survey"?loc(file.intro):stage==="report"?loc(file.question):loc(file.ending)));
      return line;
    }
    function scene() {
      const frame=element("div","sff-map");
      frame.append(pic(picture,loc(file.alt),"sff-plate"));
      file.sites.forEach((s,i)=>{
        const pin=button("look","sff-map-pin",letter(i),i);
        pin.style.left=s.x+"%";pin.style.top=s.y+"%";pin.classList.toggle("sff-pin-below",s.y<18);
        pin.classList.toggle("sff-seen",seen.includes(i));pin.classList.toggle("sff-active",focus===i);
        pin.setAttribute("aria-label",letter(i)+" · "+loc(s.name));pin.setAttribute("aria-pressed",String(focus===i));pin.title=loc(s.name);frame.append(pin);
      });
      placeTrace?.(frame);
      return frame;
    }
    function noteCard() {
      const note=element("article","sff-note");
      note.setAttribute("aria-live","polite");
      if(focus<0){
        note.classList.add("sff-unopened");
        note.append(element("span","sff-big-glass","⌖"),element("h4","",w("架起观察镜","Set up the field lens")),element("p","",w("点画面中的字母查看细节。听过伙伴的见闻、记下两处观察后，就能提出判断。","Choose a letter in the scene for a closer look. Read two observations and speak to your companion to open the report.")));
      }else if(focus===4){
        note.classList.add("sff-interview");
        const face=pic(portrait,"","sff-face");
        note.append(face,element("small","sff-kicker",w("伙伴见闻","WITNESS ACCOUNT")),element("h4","",loc(file.keeper)),element("p","",loc(file.witness)));
      }else{
        const s=file.sites[focus], crop=element("div","sff-detail");
        crop.style.backgroundImage='url("'+picture+'")';
        // Centre the lens on the same landmark as the marker, including near the edge.
        const centre=(p,scale)=>Math.min(100,Math.max(0,(p*scale-50)/(scale-1)));
        crop.style.backgroundPosition=centre(s.x,2.55)+"% "+centre(s.y,3.9)+"%";
        crop.setAttribute("role","img");crop.setAttribute("aria-label",loc(s.name));
        const badge=element("span","sff-detail-badge",letter(focus));crop.append(badge);
        note.append(crop,element("small","sff-kicker",w("观察记录","FIELD NOTE")),element("h4","",loc(s.name)),element("p","",loc(s.note)));
      }
      return note;
    }
    function survey() {
      const layout=element("div","sff-layout"),left=element("div","sff-left");left.append(scene());
      const list=element("div","sff-index");
      file.sites.forEach((s,i)=>{
        const b=button("look","sff-index-item",undefined,i); b.classList.toggle("sff-selected",focus===i);b.setAttribute("aria-pressed",String(focus===i));
        b.append(element("b","",letter(i)),element("span","",loc(s.name))); if(seen.includes(i))b.append(element("span","sff-check","✓"));
        list.append(b);
      });
      left.append(list);layout.append(left,noteCard());root.append(layout);
      const footer=element("div","sff-controls");
      const talkButton=button("talk","sff-secondary");talkButton.append(pic(portrait,"",""),element("span","",talked?w("再听"+loc(file.keeper)+"说","Hear "+loc(file.keeper)+" again"):w("询问"+loc(file.keeper),"Ask "+loc(file.keeper))));
      const status=element("span","sff-progress",w("观察 "+seen.length+"/4 · "+(talked?"已询问伙伴":"待询问伙伴"),seen.length+"/4 notes · "+(talked?"witness heard":"witness pending")));
      const report=button("report","sff-primary",w("整理调查报告 →","Build report →"));report.disabled=!ready();footer.append(talkButton,status,report);root.append(footer);
    }
    function report() {
      const layout=element("div","sff-report");
      const planBox=element("div","sff-panel"),pr=element("div","sff-panel");
      planBox.append(element("h4","",w("你的判断","Your decision")));
      file.plans.forEach((p,i)=>{const b=button("choose","sff-option",undefined,i);b.setAttribute("aria-pressed",String(i===choice));b.append(element("span","sff-radio",i===choice?"●":"○"),element("span","",loc(p.name)));planBox.append(b);});
      const testimony=element("details","sff-testimony"); testimony.append(element("summary","",loc(file.keeper)+w("的见闻","’s account")),element("p","",loc(file.witness)));planBox.append(testimony);
      pr.append(element("h4","",w("选两份支持判断的记录","Attach two supporting notes")),element("small","sff-progress",w("已选 "+pinned.length+" / 2",pinned.length+" / 2 attached")));
      file.sites.forEach((s,i)=>{
        const known=seen.includes(i),attached=pinned.includes(i);
        const b=button("pin","sff-evidence",undefined,i);b.disabled=!known;b.setAttribute("aria-pressed",String(attached));
        b.append(element("b","sff-letter",letter(i)),element("span","",known?loc(s.name):w("尚未观察","Unexamined")),element("b","sff-checkbox",attached?"✓":"+"));
        if(known)b.append(element("small","sff-evidence-note",loc(s.note)));pr.append(b);
      });
      layout.append(planBox,pr);root.append(layout);
      const replyNode=element("p","sff-response",reply);replyNode.setAttribute("role","status");replyNode.hidden=!reply;root.append(replyNode);
      const footer=element("div","sff-controls"),back=button("back","sff-secondary",w("← 重返现场","← Return to scene"));
      const submit=button("submit","sff-primary",w("提交判断","Test decision"));submit.disabled=choice<0||pinned.length!==2;footer.append(back,submit);root.append(footer);
    }
    function ending() {
      const image=element("div","sff-finale");image.append(pic(picture,loc(file.alt),"sff-plate"),element("span","sff-medal","✦"));
      const footer=element("div","sff-controls");footer.append(element("span","sff-result",w("调查印记 · ","Field stamp · ")+loc(file.stamp)),button("claim","sff-primary",w("收入伙伴手记","File in journal")));root.append(image,footer);
    }
    function draw(restore) {
      root.replaceChildren(head());
      if(stage==="survey")survey();else if(stage==="report")report();else ending();
      if(restore)root.querySelector(restore)?.focus({preventScroll:true});
    }
    function advance(next) {
      stage=next;reply="";save();draw();const h=root.querySelector(".sff-title");h.tabIndex=-1;h.focus({preventScroll:true});
      if(root.getBoundingClientRect().top<0)root.scrollIntoView({block:"start",behavior:"auto"});
    }
    function click(e) {
      const b=e.target.closest("[data-sfaction]");if(!b||!root.contains(b)||b.disabled||claimed)return;
      const id=b.dataset.sfaction,i=Number(b.dataset.sfn);
      if(id==="claim"&&stage==="ending"&&proven()){claimed=true;sound("success");onWin({region});return;}
      if(id==="report"&&ready()){advance("report");sound("tap");return;}
      if(id==="back"){advance("survey");sound("tap");return;}
      if(id==="submit"&&stage==="report"&&pinned.length===2&&choice>=0){
        if(proven()) {advance("ending");sound("success");return;}
        reply=choice!==file.answer?loc(file.plans[choice].feedback):loc(file.need);
      }else if(id==="look"&&stage==="survey"&&i>=0&&i<4){
        focus=i;if(!seen.includes(i))seen.push(i);reply="";
      }else if(id==="talk"&&stage==="survey"){focus=4;talked=true;}
      else if(id==="choose"&&stage==="report"&&i>=0&&i<3){choice=i;reply="";}
      else if(id==="pin"&&stage==="report"&&seen.includes(i)){
        const already=pinned.indexOf(i);reply="";
        if(already>=0)pinned.splice(already,1);
        else if(pinned.length<2)pinned.push(i);
        else reply=w("已经附了两份记录。先点一份已选记录取下，再换新的。","Two notes are already attached. Select an attached note to remove it before adding another.");
      }else return;
      const selector="."+b.classList[0]+'[data-sfaction="'+id+'"]'+(b.dataset.sfn===undefined?"":'[data-sfn="'+i+'"]');
      const keyboard=e.detail===0;
      save();sound("tap");draw(keyboard?selector:null);
      if(!keyboard&&(id==="look"||id==="talk")&&matchMedia("(max-width: 650px)").matches) {
        const card=root.querySelector(".sff-note");
        if(card.getBoundingClientRect().top>window.innerHeight-75)card.scrollIntoView({block:"nearest",behavior:"auto"});
      }
    }
    root.addEventListener("click",click);draw();
    return ()=>{root.removeEventListener("click",click);root.remove();};
  }
  window.StarfallField={cases,mount};
})();
