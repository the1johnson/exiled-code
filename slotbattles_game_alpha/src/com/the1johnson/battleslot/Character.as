package com.the1johnson.battleslot
{
	public class Character
	{
		private var stats:Array = new Array();
		
		public function Character(p_name:String, p_health:int, p_coins:int, p_weapon:int, p_fire:int, p_water:int, p_earth:int, p_air:int)
		{
			stats = [p_name, p_health, p_coins, p_weapon, p_fire, p_water, p_earth, p_air];
		}
		
		public function __getStats():Array
		{
			return stats;
		}
		
		public function __setName(s_name:String):void
		{
			stats[0] = s_name;
		}
		
		public function __setHealth(s_health:int):void
		{
			stats[1] = s_health;
		}
		
		public function __setCoins(s_coins:int):void
		{
			stats[2] = s_coins;
		}
		
		public function __setWeapon(s_weapon:int):void
		{
			stats[3] = s_weapon;
		}
		
		public function __setFire(s_fire:int):void
		{
			stats[4] = s_fire;
		}
		
		public function __setWater(s_water:int):void
		{
			stats[5] = s_water;
		}
		
		public function __setEarth(s_earth:int):void
		{
			stats[6] = s_earth;
		}
		
		public function __setAir(s_air:int):void
		{
			stats[7] = s_air;
		}
	}
}