import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  ShieldAlert, 
  Activity,
  Award as AwardIcon,
  PieChart,
  Calendar
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { CATEGORIES } from '../../utils/categories';

export default function ReportsView() {
  const { transactions, budgets, goals, profile } = useFintech();

  // 1. CALCULATE CORE REPORT METRICS FOR CURRENT YEAR
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  const metrics = useMemo(() => {
    const totalOutflow = transactions.reduce((sum, tx) => {
      return tx.type === 'income' ? sum : sum + tx.amount;
    }, 0);
    const totalSaved = goals.reduce((sum, gl) => sum + gl.savedAmount, 0);

    // Grouping by category (only expenses)
    const categoryAgg: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.type !== 'income') {
        categoryAgg[tx.category] = (categoryAgg[tx.category] || 0) + tx.amount;
      }
    }

    // Top Category Calculation
    let topCat = 'None';
    let topCatAmount = 0;
    Object.entries(categoryAgg).forEach(([cat, val]) => {
      if (val > topCatAmount) {
        topCat = cat;
        topCatAmount = val;
      }
    });

    // Budget performance (limit exceeds count)
    let exceededBudgets = 0;
    budgets.forEach((b) => {
      const spent = categoryAgg[b.category] || 0;
      if (spent > b.limit) exceededBudgets++;
    });

    // Simulated Growth Metrics based on chronological transaction halves
    // Split transactions list in two halves and find variance
    let growthRate = 0.0;
    if (transactions.length >= 2) {
      const mid = Math.floor(transactions.length / 2);
      const firstHalfSum = transactions.slice(mid).reduce((acc, tx) => acc + tx.amount, 0);
      const secondHalfSum = transactions.slice(0, mid).reduce((acc, tx) => acc + tx.amount, 0);
      
      if (firstHalfSum > 0) {
        growthRate = parseFloat((((secondHalfSum - firstHalfSum) / firstHalfSum) * 100).toFixed(1));
      }
    }

    return {
      totalOutflow,
      totalSaved,
      topCat,
      topCatAmount,
      exceededBudgets,
      growthRate,
      categoryAgg
    };
  }, [transactions, budgets, goals]);

  // Download tabular CSV list of the transactions
  const exportFullLedgerCSV = () => {
    if (transactions.length === 0) {
      alert('Local ledger contains no transaction rows to compile.');
      return;
    }
    
    const csvRows = [
      ['Date', 'Category', 'Notes Description', 'Method', 'Volume Spent'],
      ...transactions.map(t => [t.date, t.category, `"${t.notes}"`, t.paymentMethod, t.amount])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vaultqueue_statement_${currentMonthName.toLowerCase()}_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Browser Print trigger (which generates PDF neatly)
  const triggerBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. BUTTON CONTROLS */}
      <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left print:hidden">
        <div>
          <h4 className="font-display font-semibold text-sm text-white">Dynamic Statement Compiler</h4>
          <p className="text-[11px] text-fin-text-secondary">Synthesize structured audits and print PDF receipts</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* CSV Download */}
          <button
            id="export-report-as-csv"
            onClick={exportFullLedgerCSV}
            className="px-4 py-2 rounded-xl border border-fin-border bg-slate-900/40 hover:bg-fin-border text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            CSV Statement
          </button>

          {/* Trigger Print Modal */}
          <button
            id="print-statement-btn"
            onClick={triggerBrowserPrint}
            className="px-4 py-2 rounded-xl bg-fin-accent hover:bg-blue-600 text-xs font-semibold text-white tracking-wide shadow-lg shadow-fin-accent/15 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print statement
          </button>
        </div>
      </div>

      {/* 2. ANALYTICS METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 print:grid-cols-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total Outflow</p>
          <h4 className="text-xl font-display font-semibold text-white mt-1.5">
            {profile.currency}{metrics.totalOutflow.toFixed(2)}
          </h4>
          <span className="text-[9px] text-slate-400 font-sans block mt-1">Net expenditure</span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Top Outflow Node</p>
          <h4 className="text-xl font-display font-semibold text-white mt-1.5 truncate">
            {metrics.topCat}
          </h4>
          <span className="text-[9px] text-slate-400 font-sans block mt-1">
            {metrics.topCat !== 'None' ? `${profile.currency}${metrics.topCatAmount.toFixed(2)} total` : 'No category logged'}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Savings Allocated</p>
          <h4 className="text-xl font-display font-semibold text-white mt-1.5">
            {profile.currency}{metrics.totalSaved.toFixed(2)}
          </h4>
          <span className="text-[9px] text-fin-success font-sans block mt-1">Secured in target wallets</span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Limit Breaches</p>
          <h4 className="text-xl font-display font-semibold text-white mt-1.5">
            {metrics.exceededBudgets}
          </h4>
          <span className="text-[9px] text-fin-danger font-sans block mt-1">
            {metrics.exceededBudgets > 0 ? 'Exceeded set category budgets' : 'All budgets under watch'}
          </span>
        </div>
      </div>

      {/* 3. CORE PRINTABLE WHITE PAPER BLOCK */}
      <div 
        id="printable-report-card" 
        className="p-8 sm:p-12 rounded-2xl border border-fin-border bg-fin-card text-left max-w-4xl mx-auto space-y-8 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none"
      >
        {/* Soft grid decoration overlay (hidden during print) */}
        <div className="absolute top-0 right-0 w-[40px] h-full bg-slate-900/10 border-l border-white/[0.01] pointer-events-none print:hidden" />

        {/* Receipt Header logo */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-fin-border/60 print:border-slate-300">
          <div>
            <h2 className="font-display font-bold text-2xl tracking-tight text-white print:text-black">
              VAULT<span className="text-fin-accent">QUEUE</span> STATEMENT
            </h2>
            <p className="text-xs text-fin-text-secondary font-mono mt-1 uppercase print:text-slate-600">
              AUDIT RUN TIME: {currentMonthName} {currentYear}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-semibold bg-slate-900 border border-fin-border px-2 py-1 rounded font-mono text-slate-400 print:text-black print:border-slate-300">
              ORIGIN: CLIENT BROWSER MEMORY
            </span>
            <p className="text-[10px] text-fin-text-secondary font-sans mt-1.5 print:text-slate-600">
              ID CORP: VQ-{currentYear}-SECURE
            </p>
          </div>
        </div>

        {/* User Account Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
          <div>
            <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Statement Owner Details:</h5>
            <p className="text-sm font-semibold text-white mt-1 print:text-black">
              {profile.name || 'Anonymous Analyst'}
            </p>
            <p className="text-xs text-fin-text-secondary mt-0.5 print:text-slate-600">
              {profile.occupation || 'Asset Allocation Quant'}
            </p>
          </div>
          <div className="sm:text-right">
            <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">Security Protocol:</h5>
            <p className="text-xs text-white font-mono mt-1 print:text-black">
              No server payload routing (Zero trust Client)
            </p>
            <p className="text-[10px] text-fin-text-secondary mt-0.5 print:text-slate-600">
              Dynamic local storage hydration
            </p>
          </div>
        </div>

        {/* Executive summary and spending growth indexes */}
        <div className="p-4 rounded-xl border border-fin-border bg-slate-950/40 text-xs text-slate-300 leading-relaxed print:bg-slate-100 print:text-black print:border-slate-300">
          <span className="font-bold text-white uppercase font-mono text-[9px] tracking-widest text-fin-accent print:text-black block mb-1">
            Executive Summary Notes
          </span>
          During the calendar period of {currentMonthName} {currentYear}, the asset allocation profile experienced a net expense volume of <span className="font-semibold text-white print:text-black">{profile.currency}{metrics.totalOutflow.toFixed(2)}</span>. 
          {metrics.topCat !== 'None' ? (
            <span> Spending has concentrated prominently on <span className="font-bold text-white print:text-black">{metrics.topCat}</span> which consumed {profile.currency}{metrics.totalCatAmount ? metrics.totalCatAmount.toFixed(2) : metrics.topCatAmount.toFixed(2)}. </span>
          ) : (
            ' No categories logs have accrued during this period.'
          )}
          {metrics.growthRate !== 0 && (
            <span>Chronologically, spending has adjusted <span className={metrics.growthRate > 0 ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>{metrics.growthRate}%</span> compared to the earlier ledger records.</span>
          )}
        </div>

        {/* Spending category breakdown table */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] uppercase font-mono tracking-widest font-semibold text-slate-400 print:text-slate-600">
            Spend Allocation Breakdown
          </h4>
          
          <div className="border border-fin-border rounded-xl overflow-hidden print:border-slate-300">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900/60 text-[9px] font-mono text-slate-400 uppercase tracking-wider print:bg-slate-100 print:text-black print:border-b print:border-slate-300">
                  <th className="px-5 py-3">Category Name</th>
                  <th className="px-5 py-3">Status bounds watch</th>
                  <th className="px-5 py-3 text-right">Aggregate spends</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fin-border/60 print:divide-slate-300 text-slate-300 print:text-black">
                {Object.keys(CATEGORIES).map((catName) => {
                  const spent = metrics.categoryAgg[catName] || 0;
                  const limitObj = budgets.find((b) => b.category === catName);
                  
                  if (spent === 0 && !limitObj) return null; // Only show logged or budgeted

                  return (
                    <tr key={catName} className="print:bg-white">
                      <td className="px-5 py-3 font-semibold">{catName}</td>
                      <td className="px-5 py-3">
                        {limitObj ? (
                          <span className={spent > limitObj.limit ? 'text-fin-danger font-bold' : 'text-fin-success'}>
                            Limit: {profile.currency}{limitObj.limit} ({spent > limitObj.limit ? 'Overspend' : 'OK'})
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">No bound set</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-white print:text-black">
                        {profile.currency}{spent.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-slate-500 font-sans print:text-slate-600">
                      <div className="flex flex-col items-center justify-center py-4 max-w-xs mx-auto">
                        <FileText className="h-8 w-8 text-slate-600 mb-3 animate-pulse print:text-slate-400" />
                        <p className="text-xs font-semibold text-white print:text-black">No Active Records Cataloged</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed print:text-slate-500">
                          Register cash flows or seed the sandbox to automatically synthesize audited categorical statement values.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable footer certification */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-fin-border/60 text-[10px] text-slate-500 print:border-slate-300 print:text-slate-600 gap-4">
          <div className="text-center sm:text-left">
            <p>VaultQueue Secure Statement Hash Code: vq-sha256-local-sandbox</p>
            <p className="mt-0.5">Report generated automatically by dynamic React layout bindings on {new Date().toISOString().split('T')[0]}.</p>
          </div>
          <div className="text-center sm:text-right">
            <div className="w-32 h-6 border-b border-fin-border border-dashed mb-1.5 mx-auto sm:ml-auto print:border-slate-400" />
            <p className="uppercase tracking-widest font-mono text-[8px] font-semibold">Authorized Audit stamp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
