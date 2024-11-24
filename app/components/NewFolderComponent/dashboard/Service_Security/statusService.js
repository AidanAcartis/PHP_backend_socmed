import EvaluationChart from "../../SectionSecurity/secuGraph/evaluationChart";
import GeographicDistributionChart from "../../SectionSecurity/secuGraph/geoGrap";
import ReportsByPersonChart from "../../SectionSecurity/secuGraph/reportGraph";
import SignalementCharts from "../../SectionSecurity/secuGraph/statusChart";

export default function ServiceStatus() {

    return(
        <div>
            <EvaluationChart />
            <GeographicDistributionChart />
            <ReportsByPersonChart />
            <SignalementCharts />
        </div>
    );
};