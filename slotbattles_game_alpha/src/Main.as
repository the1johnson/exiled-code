package
{
	import com.gskinner.motion.GTween;
	import com.the1johnson.battleslot.Character;
	import com.the1johnson.battleslot.DirectDamage;
	import com.the1johnson.battleslot.Heal;
	import com.the1johnson.battleslot.JackpotManip;
	import com.the1johnson.battleslot.Slot;
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;
	
	[SWF(width="720", height="480", frameRate="60", backgroundColor="#3A3A3A")]
	public class Main extends MovieClip
	{
		private var slot_machine:Slot;
		private var slot_reels:int = 5;
		private var slot_rows:int = 3;
		private var slot_lines:int = 3;
		private var slot_machine_mc:MovieClip = new MovieClip();
		private var gems:Array = new Array();
		private var gems_fake:Array = new Array();
		private var fake_gems:int = 50;
		private var gem_padding:int = 25;
		private var is_spinning:Boolean = false;
		private var anim_speed:int = 20;
		private var playerTurn:Boolean = false;
		private var playerOne:Character;
		private var enemyOne:Character;
		private var playerText:TextField;
		private var enemyText:TextField;
		private var payoutText:TextField;
		private var enemyTimer:Timer = new Timer(2000);
		
		//abilities
		private var abilityDD:DirectDamage;
		private var abilityHeal:Heal;
		private var abilityJackpotManip:JackpotManip;
		
		public function Main()
		{
			init();
		}
		
		private function init():void
		{
			//Add slot art and fake rows for animation
			initialArt();
			initialFake();
			//Add Event Listeners
			stage.addEventListener(KeyboardEvent.KEY_DOWN, keyCheck);
			stage.addEventListener(Event.ENTER_FRAME, frameEnter);
			//Add Characters
			playerTurn = true;
			playerOne = new Character("Player", 100, 100, 50, 50, 50, 50, 50);
			enemyOne = new Character("Enemy", 100, 100, 0, 0, 0, 0, 0);
			//temp set up testing text
			fakeTextSetup();
			//temp ability setup
			fakeAbilitySetup();
		}
		
		private function initialArt():void
		{
			//Place all BG art
			var slotbg:MovieClip = new SlotBG();
			slotbg.x = stage.stageWidth - slotbg.width;
			addChild(slotbg);
			//trace(slotbg.width	21	);
			//Set up and place new slot machine
			slot_machine = new Slot(slot_reels,slot_rows, slot_lines);
			slot_machine_mc.x = stage.stageWidth - slotbg.width;
			//slot_machine_mc.y = 70;
			addChild(slot_machine_mc);
			
			//Place reels
			var g_reels:Array = slot_machine.__getReels();
			trace(g_reels);
			for(var i:int=0; i<slot_reels; i++)
			{
				gems[i] = new MovieClip();
				for(var k:int=0; k<slot_rows; k++)
				{
					var new_gem:Gem = new Gem();
					if(k == 0)
					{
						new_gem.y = 20;
					}
					else if(k == 1)
					{
						new_gem.y = 120;
					}
					else if( k == 2)
					{
						new_gem.y = 220;
					}
					
					if(g_reels[i][k] == 11 || g_reels[i][k] == 4)
					{
						new_gem.y = new_gem.y - 10;
					}
					
					if(k==0 && g_reels[i][0]==10 && g_reels[i][1]==10)
					{
						//trace('on 1st with 1st and 2nd are wild');
						new_gem.gotoAndStop(g_reels[i][k]);
					}
					else if(k==1 && g_reels[i][0]==10 && g_reels[i][1]==10)
					{
						//trace('on 2nd with 1st and 2nd are wild');
						new_gem.gotoAndStop(12);
					}
					else if(k==1 && g_reels[i][1]==10 && g_reels[i][2]==10)
					{
						//trace('on 2nd with 2nd and 3rd are wild');
						new_gem.gotoAndStop(g_reels[i][k]);
					}
					else if(k==2 && g_reels[i][1]==10 && g_reels[i][2]==10)
					{
						//trace('on 3rd with 2nd and 3rd are wild');
						new_gem.gotoAndStop(12);
					}
					else if(k==2 && g_reels[i][0] == 10 && g_reels[i][1]==10)
					{
						//trace('on 3rd with 1st and 2nd are wild');
						new_gem.gotoAndStop(g_reels[i][k]);
					}
					else
					{
						new_gem.gotoAndStop(g_reels[i][k]);
					}
					gems[i].addChild(new_gem);
				}
			}
			
			for(var q:int=0; q<gems.length; q++)
			{
				gems[q].x = (85*q)+15;
				slot_machine_mc.addChild(gems[q]);
			}
		}
		
		private function initialFake():void
		{
			for(var i:int=0; i<slot_reels; i++)
			{
				gems_fake[i] = new MovieClip();
				for(var k:int=0; k<fake_gems; k++)
				{
					var new_gem:Gem = new Gem();
					new_gem.gotoAndStop(slot_machine.randSlot());
					new_gem.y = (new_gem.height+gem_padding)*k;
					gems_fake[i].addChild(new_gem);
				}
				gems_fake[i].x = (gems_fake[i].width+gem_padding)*i;
				gems_fake[i].y = (gems_fake[i].height+gem_padding)*-1;
				
			}
			
			for(var q:int=0; q<gems_fake.length; q++)
			{
				slot_machine_mc.addChild(gems_fake[q]);
			}
		}
		
		private function frameEnter(e:Event):void
		{
			if(!playerTurn && !is_spinning)
			{
				enemyAI();
			}
		}
		
		private function keyCheck(e:KeyboardEvent):void
		{
			if(e.charCode == 32 && !is_spinning && playerTurn)
			{
				//Press Space to spin slot
				is_spinning = true;
				//addEventListener(Event.ENTER_FRAME, animateSpin);
				tweenSpin();
				playerTurn = false;
			}
		}
		
		private function updateGems():void
		{
			var g_reels:Array = slot_machine.__getReels();
			//trace(g_reels);
			for(var i:int=0; i<slot_reels; i++)
			{
				for(var k:int=0; k<slot_rows; k++)
				{
					if(k==0 && g_reels[i][0]==10 && g_reels[i][1]==10)
					{
						//trace('on 1st with 1st and 2nd are wild');
						gems[i].getChildAt(k).gotoAndStop(g_reels[i][k]);
					}
					else if(k==1 && g_reels[i][0]==10 && g_reels[i][1]==10)
					{
						//trace('on 2nd with 1st and 2nd are wild');
						gems[i].getChildAt(k).gotoAndStop(12);
					}
					else if(k==1 && g_reels[i][1]==10 && g_reels[i][2]==10)
					{
						//trace('on 2nd with 2nd and 3rd are wild');
						gems[i].getChildAt(k).gotoAndStop(g_reels[i][k]);
					}
					else if(k==2 && g_reels[i][1]==10 && g_reels[i][2]==10)
					{
						//trace('on 3rd with 2nd and 3rd are wild');
						gems[i].getChildAt(k).gotoAndStop(12);
					}
					else if(k==2 && g_reels[i][0] == 10 && g_reels[i][1]==10)
					{
						//trace('on 3rd with 1st and 2nd are wild');
						gems[i].getChildAt(k).gotoAndStop(g_reels[i][k]);
					}
					else
					{
						gems[i].getChildAt(k).gotoAndStop(g_reels[i][k]);
					}
				}
			}
		}
		
		private function tweenSpin():void
		{
			var gemFakeTween:GTween = new GTween(gems_fake[0], 75);
			var gemTween:GTween = new GTween(gems[0], 30);
			/*gemFakeTween.setValue('y', slot_machine_mc.height+gems_fake[0].height);
			gemTween.setValue('y', slot_machine_mc.height+gems[0].height);*/
			
			//after spining swap art and check lines
			slot_machine.spinSlot();
			updateGems();
			if(playerTurn)
			{
				var stats:Array = playerOne.__getStats();
				playerOne.__setCoins(stats[2] - (1*slot_lines));
			}else{
				var enemy_stats:Array = enemyOne.__getStats();
				enemyOne.__setCoins(enemy_stats[2] - (1*slot_lines));
			}
			if(slot_machine.checkLines() != false)
			{
				rewardPayout();
			}else{
				payoutText.text = "Still No Payout";
				if(!playerTurn)
				{
					payoutText.text = "Enemy Spin:\nStill No Payout";
				}
			}
			fakeTextUpdate();
			is_spinning = false;
		}
		
		/*private function animateSpin(e:Event):void
		{
			//gems[0].y = gems[0].y+anim_speed;
			gems_fake[0].y = gems_fake[0].y+anim_speed;
			if(gems_fake[0].y <= stage.height)
			{
				//trace("bem");
			}
		}*/
		
		private function rewardPayout():void
		{
			var pay:Array = slot_machine.__getPayout();
			var stats:Array = playerOne.__getStats();;
			var enemy_stats:Array = enemyOne.__getStats();;
			var newText:String = "";
			for(var i:int=0; i<pay.length; i++)
			{
				var w_line:int = pay[i][0];
				var w_icon:int = pay[i][1];
				var w_matches:int = pay[i][2];
				var w_multi:int = pay[i][3];
				
				if(w_multi>0){
					w_matches = w_matches*w_multi;
				}

				if(w_icon == 1)
				{
					if(playerTurn)
					{
						//coin
						playerOne.__setCoins(stats[2]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Coin, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setCoins(enemy_stats[2]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Coin, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 2)
				{
					if(playerTurn)
					{
						//damage
						trace("deal "+w_matches+" damage");
						enemyOne.__setHealth(enemy_stats[1]-w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Damage, Amount Won: "+w_matches+"\n";
					}
					else
					{
						playerOne.__setHealth(stats[1]-w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Damage, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 3)
				{
					if(playerTurn)
					{
						//heal
						playerOne.__setHealth(stats[1]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Heal, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setHealth(enemy_stats[1]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Heal, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 4)
				{
					if(playerTurn)
					{
						//weapon
						playerOne.__setWeapon(stats[3]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Weapon, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setWeapon(enemy_stats[3]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Weapon, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 5)
				{
					if(playerTurn)
					{
						//water
						playerOne.__setWater(stats[5]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Water, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setWater(enemy_stats[5]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Water, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 6)
				{
					if(playerTurn)
					{
						//fire
						playerOne.__setFire(stats[4]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Fire, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setFire(enemy_stats[4]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Fire, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 7)
				{
					if(playerTurn)
					{
						//earth
						playerOne.__setEarth(stats[6]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Earth, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setEarth(enemy_stats[6]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Earth, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 8)
				{
					if(playerTurn)
					{
						//air
						playerOne.__setAir(stats[7]+w_matches);
						newText += "Winning Line: "+w_line+", Winning Icon Type: Air, Amount Won: "+w_matches+"\n";
					}
					else
					{
						enemyOne.__setAir(enemy_stats[7]+w_matches);
						newText += "Enemy Spin:\nWinning Line: "+w_line+", Winning Icon Type: Air, Amount Won: "+w_matches+"\n";
					}
				}
				else if(w_icon == 11)
				{
					if(playerTurn)
					{
						//jackpot
						trace("JACKPOT WON!!");
						newText += "Winning Line: "+w_line+", JACKPOT WON!";
					}
					else
					{
						trace("JACKPOT WON!!");
						newText += "Enemy Spin:\nWinning Line: "+w_line+", JACKPOT WON!";
					}
				}
			}
			payoutText.text = newText;
		}
		
		private function enemyAI():void
		{
			enemyTimer.addEventListener(TimerEvent.TIMER, enemySpin);
			is_spinning = true;
			//payoutText.text = "ENEMY TURN";
			enemyTimer.start();
		}
		
		private function enemySpin(e:TimerEvent):void
		{
			//trace("timer ran");
			enemyTimer.stop();
			tweenSpin();
			playerTurn = true;
		}
		
		private function fakeTextSetup():void
		{
			var stats:Array = playerOne.__getStats();
			var enemy_stats:Array = enemyOne.__getStats();
			playerText = new TextField();
			enemyText = new TextField();
			
			playerText.text = "Player Name: "+stats[0]+"\nHealth: "+stats[1]+"\nCoins: "+stats[2]+"\n~Weapon: "+stats[3]+"\n~Fire: "+stats[4]+"\n~Water: "+stats[5]+"\n~Earth: "+stats[6]+"\n~Air: "+stats[7];
			playerText.textColor = 0xFFFFFF;
			playerText.y = 350;
			playerText.width = 150;
			
			enemyText.text = "Player Name: "+enemy_stats[0]+"\nHealth: "+enemy_stats[1]+"\nCoins: "+enemy_stats[2]+"\n~Weapon: "+enemy_stats[3]+"\n~Fire: "+enemy_stats[4]+"\n~Water: "+enemy_stats[5]+"\n~Earth: "+enemy_stats[6]+"\n~Air: "+enemy_stats[7];
			enemyText.textColor = 0xFFFFFF;
			enemyText.y = 350;
			enemyText.x = 550;
			enemyText.width = 150;
			
			payoutText = new TextField();
			payoutText.textColor = 0xFFFFFF;
			payoutText.text = "No Payout";
			payoutText.y = 350;
			payoutText.x = 150;
			payoutText.width = 500;
			
			addChild(playerText);
			addChild(enemyText);
			addChild(payoutText);
		}
		
		private function fakeTextUpdate():void
		{
			var stats:Array = playerOne.__getStats();
			var enemy_stats:Array = enemyOne.__getStats();
			
			playerText.text = "Player Name: "+stats[0]+"\nHealth: "+stats[1]+"\nCoins: "+stats[2]+"\n~Weapon: "+stats[3]+"\n~Fire: "+stats[4]+"\n~Water: "+stats[5]+"\n~Earth: "+stats[6]+"\n~Air: "+stats[7];
			enemyText.text = "Player Name: "+enemy_stats[0]+"\nHealth: "+enemy_stats[1]+"\nCoins: "+enemy_stats[2]+"\n~Weapon: "+enemy_stats[3]+"\n~Fire: "+enemy_stats[4]+"\n~Water: "+enemy_stats[5]+"\n~Earth: "+enemy_stats[6]+"\n~Air: "+enemy_stats[7];
		}
		
		private function fakeAbilitySetup():void
		{
			abilityDD = new DirectDamage(4, 5, 15);
			var fakeDD:MovieClip = new MovieClip();
			fakeDD.graphics.beginFill(0xFF0000);
			fakeDD.graphics.drawRect(0, 0, 20, 20);
			fakeDD.graphics.endFill();
			fakeDD.buttonMode = true;
			fakeDD.x = 200;
			fakeDD.y = 450;
			fakeDD.addEventListener(MouseEvent.CLICK, playerDDAbility);
			addChild(fakeDD);
			
			abilityHeal = new Heal(5, 5, 10);
			var fakeHeal:MovieClip = new MovieClip();
			fakeHeal.graphics.beginFill(0x0000FF);
			fakeHeal.graphics.drawRect(0, 0, 20, 20);
			fakeHeal.graphics.endFill();
			fakeHeal.buttonMode = true;
			fakeHeal.x = 240;
			fakeHeal.y = 450;
			fakeHeal.addEventListener(MouseEvent.CLICK, playerHealAbility);
			addChild(fakeHeal);
			
			abilityJackpotManip = new JackpotManip(0, 15);
			var fakeJacpotManip:MovieClip = new MovieClip();
			fakeJacpotManip.graphics.beginFill(0xFFD700);
			fakeJacpotManip.graphics.drawRect(0, 0, 20, 20);
			fakeJacpotManip.graphics.endFill();
			fakeJacpotManip.buttonMode = true;
			fakeJacpotManip.x = 280;
			fakeJacpotManip.y = 450;
			fakeJacpotManip.addEventListener(MouseEvent.CLICK, playerJackpotAbility);
			addChild(fakeJacpotManip);
		}
		
		private function playerDDAbility(e:MouseEvent):void
		{
			var stats:Array = playerOne.__getStats();
			var enemy_stats:Array = enemyOne.__getStats();
			if(!playerTurn)
			{
				return ;
			}
			
			if(stats[abilityDD.__getResource()] >= abilityDD.__getCost())
			{
				payoutText.text = "Player used ability 15 damage dealt";
				playerOne.__setFire(stats[abilityDD.__getResource()] - abilityDD.__getCost());
				enemyOne.__setHealth(enemy_stats[1] - abilityDD.__getEffect());
				fakeTextUpdate();
			}
			else
			{
				payoutText.text = "Insufficent Fire resource";
			}
		}
		
		private function playerHealAbility(e:MouseEvent):void
		{
			var stats:Array = playerOne.__getStats();
			if(!playerTurn)
			{
				return ;
			}
			if(stats[abilityHeal.__getResource()] >= abilityHeal.__getCost())
			{
				payoutText.text = "Player healed 10 damage";
				playerOne.__setHealth(stats[1] + abilityHeal.__getEffect());
				playerOne.__setWater(stats[abilityHeal.__getResource()] - abilityHeal.__getCost());
				fakeTextUpdate();
			}
			else
			{
				payoutText.text = "Insufficent Water resource";
			}
		}
		private function playerJackpotAbility(e:MouseEvent):void
		{
			var stats:Array = playerOne.__getStats();
			if(!playerTurn)
			{
				return ;
			}
			if(stats[4] >= abilityJackpotManip.__getCost() && stats[5] >= abilityJackpotManip.__getCost() && stats[6] >= abilityJackpotManip.__getCost() && stats[7] >= abilityJackpotManip.__getCost())
			{
				//slot_machine.__increaseJackpotManip();
				payoutText.text = "Jackpot Manipulated";
				playerOne.__setFire(stats[4] - abilityJackpotManip.__getCost());
				playerOne.__setWater(stats[5] - abilityJackpotManip.__getCost());
				playerOne.__setEarth(stats[6] - abilityJackpotManip.__getCost());
				playerOne.__setAir(stats[7] - abilityJackpotManip.__getCost());
				fakeTextUpdate();
			}
			else
			{
				payoutText.text = "Insufficent resources";
			}
		}
	}
}