interface StatusColors {
    Ordered: string;
    Dispatched: string;
    Delivered: string;
    Cancelled: string;
  }

  interface Variant{
    colorVariantId: number | null;
    sizeVariantId: number | null;
    quantity: number;
  }