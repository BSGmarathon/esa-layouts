// The object from the tracker API.
interface BidFields {
  bid_type: 'challenge' | 'choice' | 'option';
  name: string;
  speedrun: number;
  parent: number | null;
  description: string; // Can be empty
  shortdescription: string; // Can be empty
  istarget: boolean;
  allowuseroptions?: boolean;
  goal: number | null;
  state: string;
  total: number;
  close_at: string | null;
}

interface BidChildFields extends BidFields {
  parent: number;
}

export namespace Tracker {
  interface EventInfo {
    id: number;
    short: string;
    total: number;
  }

  interface Speedrun {
    type: 'speedrun';
    id: number;
    name: string;
    display_nane: string;
    category: string;
  }

  // The object(s) from the tracker API.
  interface Bid extends BidFields {
    id: number;
    type: string;
  }
  interface BidChild extends BidChildFields {
    id: number;
    type: string;
  }

  interface FormattedBid {
    id: number;
    name: string;
    description?: string;
    total: number;
    game?: string;
    category?: string;
    endTime?: number;
    war: boolean;
    allowUserOptions: boolean;
    options: {
      id: number;
      parent: number;
      name: string;
      total: number;
    }[];
    goal?: number;
  }

  // The object from the tracker API.
  interface Prize {
    id: number;
    type: string;
    name: string;
    description: string; // Can be empty
    shortdescription: string; // Can be empty
    provider: string; // Can be empty
    minimumbid: number;
    image: string; // Can be empty
    altimage: string; // Can be empty
    startrun: number | null;
    endrun: number | null;
    starttime: string | null;
    endtime: string | null;
    state: string;
  }

  interface FormattedPrize {
    id: number;
    name: string;
    provided?: string;
    minimumBid: number;
    image?: string;
    startTime?: number;
    endTime?: number;
  }

  // The object from the tracker API.
  interface Donation {
    id: number;
    type: string;
    donor_name: string;
    amount: number;
    comment: string; // Can be empty
    commentstate: string;
    timereceived: string;
  }

  interface FormattedDonation {
    id: number;
    name: string;
    amount: number;
    comment?: string;
    timestamp: number;
  }
}
