export const fetchTotalPlaintes = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/total');
    return res.json();
  };

  export const fetchTotalStatusPlaintes = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/repartition_status');
    return res.json();
  };
  
  export const fetchRepartitionParRegion = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/repartition');
    return res.json();
  };
  
  export const fetchTypesDeViolences = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/types');
    return res.json();
  };
  
  export const fetchStatsParJour = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/par-jour');
    return res.json();
  };
  
  export const fetchTempsMoyen = async () => {
    const res = await fetch('http://localhost:3003/api/plaintes/temps-moyen');
    return res.json();
  };