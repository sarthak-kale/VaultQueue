import { Transaction } from '../types';

export interface SubscriptionMeta {
  name: string;
  amount: number;
  category: string;
  iconName: string;
  nextBillingDate: string;
}

export function detectSubscription(tx: Transaction): { isSub: boolean; subName?: string } {
  const notesLower = tx.notes.toLowerCase();
  
  if (notesLower.includes('netflix')) {
    return { isSub: true, subName: 'Netflix' };
  }
  if (notesLower.includes('spotify')) {
    return { isSub: true, subName: 'Spotify' };
  }
  if (notesLower.includes('prime') || notesLower.includes('amazon prime')) {
    return { isSub: true, subName: 'Prime' };
  }
  if (notesLower.includes('youtube') || notesLower.includes('yt premium')) {
    return { isSub: true, subName: 'YouTube Premium' };
  }
  
  return { isSub: false };
}

export function getRunningSubscriptions(transactions: Transaction[]): SubscriptionMeta[] {
  // Return accumulated unique active subscriptions based on the latest recurring indicators
  const subsMap = new Map<string, SubscriptionMeta>();
  
  // Sort oldest to newest to ensure latest transaction amount represents current cost
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  for (const tx of sortedTx) {
    const rx = detectSubscription(tx);
    if (rx.isSub && rx.subName) {
      // Calculate a pseudo next billing date (same day next month)
      const dateObj = new Date(tx.date);
      dateObj.setMonth(dateObj.getMonth() + 1);
      const nextDateStr = dateObj.toISOString().split('T')[0];
      
      subsMap.set(rx.subName, {
        name: rx.subName,
        amount: tx.amount,
        category: tx.category,
        iconName: rx.subName,
        nextBillingDate: nextDateStr
      });
    }
  }
  
  return Array.from(subsMap.values());
}
