export interface SelectedService {
  categoryId: string;
  serviceId: string;
  quantity: number;
}

export interface CalculatorState {
  selectedServices: SelectedService[];
  discount: number;
  customDiscount: number | null;
}

export interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

export interface EstimateResult {
  subtotal: number;
  discountAmount: number;
  total: number;
  items: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}
