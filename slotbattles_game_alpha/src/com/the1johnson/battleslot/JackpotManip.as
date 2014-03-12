package com.the1johnson.battleslot
{
	public class JackpotManip
	{
		private var resource:int;
		private var cost:int;
		
		public function JackpotManip(p_resource:int, p_cost:int)
		{
			resource = p_resource;
			cost = p_cost;
		}
		
		public function __getResource():int
		{
			return resource;
		}
		
		public function __getCost():int
		{
			return cost;
		}
	}
}