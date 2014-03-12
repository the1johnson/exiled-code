package com.the1johnson.battleslot
{

	public class Slot
	{
		private var reel_num:int;
		private var row_num:int;
		private var reels:Array;
		private var total_lines:int;
		private var lines:Object = new Object();
		private var payout:Array;
		private var jackpotManip:int;
		
		public function Slot(p_reels:int, p_rows:int, p_lines:int)
		{
			reel_num = p_reels;
			row_num = p_rows;
			total_lines = p_lines;
			jackpotManip = 0;
			init();
		}
		
		private function init():void
		{
			reels = new Array();
			payout = new Array();
			buildMachine();
		}
		
		public function __getReels():Array
		{
			return reels;
		}
		
		public function __getPayout():Array
		{
			return payout;
		}
		
		public function __increaseJackpotManip():void
		{
			jackpotManip++;
		}
		
		private function updateLines():void
		{
			lines.line_one = [reels[0][1], reels[1][1], reels[2][1], reels[3][1], reels[4][1]];
			lines.line_two = [reels[0][2], reels[1][2], reels[2][2], reels[3][2], reels[4][2]];
			lines.line_three = [reels[0][0], reels[1][0], reels[2][0], reels[3][0], reels[4][0]];
			lines.line_four = [reels[0][0], reels[1][1], reels[2][2], reels[3][1], reels[4][0]];
			lines.line_five = [reels[0][2], reels[1][2], reels[2][0], reels[3][1], reels[4][2]];
			lines.line_six = [reels[0][0], reels[1][0], reels[2][1], reels[3][2], reels[4][2]];
			lines.line_seven = [reels[0][2], reels[1][2], reels[2][1], reels[3][0], reels[4][0]];
			lines.line_eight = [reels[0][1], reels[1][2], reels[2][1], reels[3][0], reels[4][1]];
			lines.line_nine = [reels[0][1], reels[1][0], reels[2][1], reels[3][2], reels[4][1]];
		}
		
		private function buildMachine():void
		{
			//Build Reels
			for(var i:int=0; i<reel_num; i++)
			{
				//Add new array == reel
				reels[i] = new Array();
				for(var k:int=0; k<row_num; k++)
				{
					//Adds random slot nums based on how many rows
					var slot_num:int = randSlot();
					reels[i].push(slot_num);
				}
			}
			checkReels();
			updateLines();
		}
		
		public function spinSlot():void
		{
			for(var i:int=0; i<reel_num; i++)
			{
				for(var k:int=0; k<row_num; k++)
				{
					//Updates Slots
					var slot_num:int = randSlot();
					reels[i][k] = slot_num;
				}
			}
			checkReels();
			//jackpot manipulation
			if(jackpotManip > 0)
			{
				manipJackpot();
				jackpotManip = 0;
			}
			updateLines();
		}
		
		public function randSlot():int
		{
			var r_slot:int;
			var rand_num:int = Math.random() * (100 - 1) + 1;
			
			/*
			10% each Fire, Earth, Water, Air
			10% each Damage, Coin, Weapon, Heal
			5% Multiplyer
			5% 2 Space Wild
			10% Jackpot
			*/
			
			if(rand_num<11)
			{
				//Fire Gem = 0-10
				r_slot = 6;
			}
			else if(rand_num>10 && rand_num<21)
			{
				//Earth Gem = 11-20
				r_slot = 7;
			}
			else if(rand_num>20 && rand_num<31)
			{
				//Water Gem = 21-30
				r_slot = 5;
			}
			else if(rand_num>30 && rand_num<41)
			{
				//Air Gem = 31-40
				r_slot = 8;
			}
			else if(rand_num>40 && rand_num<52)
			{
				//Damage Gem = 41-51
				r_slot = 2;
			}
			else if(rand_num>50 && rand_num<63)
			{
				//Coin Gem = 51-62
				r_slot = 1;
			}
			else if(rand_num>1 && rand_num<74)
			{
				//Weapon Gem = 62-73
				r_slot = 4;
			}
			else if(rand_num>72 && rand_num<85)
			{
				//Heal Gem = 73-84
				r_slot = 3;
			}
			else if(rand_num>84 && rand_num<91)
			{
				//Multiplyer Gem = 85-90
				r_slot = 9;
			}
			else if(rand_num==91)
			{
				//Wild Gem = 91
				r_slot = 10;
			}
			else if(rand_num>91 && rand_num<101)
			{
				//Jackpot = 92-100
				r_slot = 11;
			}
			
			return r_slot;
		}
		
		private function manipJackpot():void
		{
			for(var i:int = 0; i<jackpotManip; i++)
			{
				var rand_num:int = Math.random() * 3;
				trace('before'+reels[i][rand_num]);
				reels[i][rand_num] = 11;
				trace('after'+reels[i][rand_num]);
			}
		}
		
		public function checkLines():Boolean
		{
			var winner:Boolean = false;
			var targmatch:int;
			var matches:int = 0;
			var tmpArray:Array;
			var multiplyer:int = 0;
			
			//start with an empty payout array
			payout.splice(0);
			
			for(var i:int = 0; i<total_lines; i++)
			{
				//reset matches
				matches = 0;
				//set temp array to current line that is being checked
				if(i==0)
				{
					tmpArray = lines.line_one;
				}
				else if(i==1)
				{
					tmpArray = lines.line_two;
				}
				else if(i==2)
				{
					tmpArray = lines.line_three;
				}
				else if(i==3)
				{tmpArray = lines.line_four;
					
				}
				else if(i==4)
				{
					tmpArray = lines.line_five;
				}
				else if(i==5)
				{
					tmpArray = lines.line_six;
				}
				else if(i==6)
				{
					tmpArray = lines.line_seven;
				}
				else if(i==7)
				{
					tmpArray = lines.line_eight;
				}
				else if(i==8)
				{
					tmpArray = lines.line_nine;
				}

				for(var q:int = 0; q<tmpArray.length; q++)//find first nonwild slot to check against
				{
					if((tmpArray[q] != 9) && (tmpArray[q] != 10))
					{
						targmatch = tmpArray[q];
						q=tmpArray.length;
					}
				}
				for(var k:int = 0; k<tmpArray.length; k++)
				{

					if(tmpArray[k] == targmatch)
					{
						//trace("line: "+i+" Line Array: "+tmpArray+" position: "+k+" reel: "+tmpArray[k]+" target: "+targmatch);
						matches++;
					}
					
					if(tmpArray[k] != targmatch)
					{
						if((tmpArray[k] == 9) || (tmpArray[k] == 10))
						{
							//trace("line: "+i+" Line Array: "+tmpArray+" wild position: "+k+" reel: "+tmpArray[k]+" target: "+targmatch);
							if(tmpArray[k] == 9){multiplyer += 2}
							matches++;
						}
						else
						{
							//trace("line: "+i+" Line Array: "+tmpArray+" fail position: "+k+" reel: "+tmpArray[k]+" target: "+targmatch);
							k = tmpArray.length;
						}
					}
				}
				if(matches >= 3)
				{
					//add payout to pay array
					//trace("winning line: "+i+" winning reel: "+targmatch+" matches: "+matches);
					if(winner != true){winner = true;}
					payout.push([i, targmatch, matches, multiplyer]);
				}
			}
			//trace("matches: "+matches+"\nwinner: "+winner);
			return winner;
		}
		
		private function checkReels():void
		{
			for(var i:int=0; i<reels.length; i++)
			{
				if(reels[i][0] == 10 && reels[i][2] == 10)
				{
					//If first and last slot of the reel are both 2 space wilds then change the first
					do{ reels[i][0] = randSlot(); } while(reels[i][0] == 10)
				}
				if(reels[i][0] == 10)
				{
					//If first slot is wild then so is second
					reels[i][1] = 10;
				}
				if(reels[i][1] == 10 && reels[i][0] != 10)
				{
					//If second slot is wild and first slot isn't then so is third
					reels[i][2] = 10;
				}
				if(reels[i][2] == 10)
				{
					//If third slot is wild then so is second
					reels[i][1] = 10
				}
			}
		}
	}
}