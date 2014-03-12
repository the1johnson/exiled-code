package com.the1johnson.battleslot
{
	public class Heal
	{
		private var resource:int;
		private var cost:int;
		private var effect:int;
		
		public function Heal(p_resource:int, p_cost:int, p_effect:int)
		{
			resource = p_resource;
			cost = p_cost;
			effect = p_effect;
		}
		
		public function __getResource():int
		{
			return resource;
		}
		
		public function __getCost():int
		{
			return cost;
		}
		
		public function __getEffect():int
		{
			return effect;
		}
	}
}