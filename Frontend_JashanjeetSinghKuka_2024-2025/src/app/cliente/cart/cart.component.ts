import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UseStateService } from '../../services/auth/use-state.service';
import { TokenService } from '../../services/auth/token.service';
import { PopupService } from '../../services/utils/popup.service';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const stripePromise = loadStripe('pk_test_51RRdljC4353wXFaoGoom4m22qNrE7JL14mtFSO84AEZf9rvTEfLLINZ8FZ7vc8YDIpQTExae4ZGi02xhDgYMBXck00Ty9Zdi75');


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Array to hold cart items
  totals: { [key: string]: number } = {}; // Object to hold totals for each currency

  // Currency map for formatting prices
  currencyMap: { [key: string]: string } = {
    USD: '$', 
    EUR: '€', 
    // Add more currencies as needed
  };

  constructor(
    private cartService: CartService,
    private router: Router,
    private userStateService: UseStateService,
    private tokenService: TokenService,
    private popupService: PopupService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Subscribe to cart changes
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotals(); // Recalculate totals whenever the cart changes
    });
  }

  increaseQuantity(productId: number) {
    const product = this.cart.find((p) => p.id === productId);
    if (product) {
      this.cartService.updateQuantity(productId, product.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const product = this.cart.find((p) => p.id === productId);
    if (product) {
      this.cartService.updateQuantity(productId, product.quantity - 1);
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  calculateTotals() {
    this.totals = {}; // Reset totals

    this.cart.forEach((product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 0;
      const currency = product.currency || 'USD';

      if (!this.totals[currency]) {
        this.totals[currency] = 0;
      }
      this.totals[currency] += price * quantity;
    });
  }

  clearCart() {
    this.cartService.clearCart();
  }

  // Helper method to get currency symbol
  getCurrencySymbol(currencyCode: string): string {
    return this.currencyMap[currencyCode] || currencyCode; // Fallback to currency code if symbol not found
  }

  // Helper method to get currencies in the cart
  getCurrencies(): string[] {
    return Object.keys(this.totals);
  }

  // Helper method to check if a currency is the last in the list
  isLastCurrency(currency: string): boolean {
    const currencies = this.getCurrencies();
    return currencies.indexOf(currency) === currencies.length - 1;
  }
  navigateToAllProducto() {
    const userRole = this.userStateService.getRole();

    if (userRole === 'STUDENT') {
      this.router.navigate(['student/skillSphere']); // Navigate to admin profile
    } else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/skillSphere']); // Navigate to client profile
    } else if (userRole === 'TEACHER') {
      this.router.navigate(['teacher/skillSphere']); // Navigate to client profile
    }
    else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
  navigateToPagar() {
    const userRole = this.userStateService.getRole();

    if (userRole === 'STUDENT') {
      this.router.navigate(['student/forma-pago']); // Navigate to admin profile
    }  else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/forma-pago']); // Navigate to client profile
    }else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }

async checkout() {
  const stripe = await stripePromise;
  const eurTotal = this.totals['EUR'] || 0;
  const amountInCents = Math.round(eurTotal * 100);
  const postId = this.cart[0]?.id;

  const payload = {
    productName: 'SkillSphere Cart Payment',
    amount: amountInCents,
    userRole: this.userStateService.getRole(),
    username: this.userStateService.getUsername(),
    postId: postId
  };

  const token = this.tokenService.getAccessToken();

  // 🔁 Show loading popup
  this.popupService.showLoading('Payment in process...');

  // 🕐 Wait 5 seconds before sending the request
  setTimeout(() => {
    this.http.post<any>(
      'http://localhost:8080/api/api/create-checkout-session',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: async (session: any) => {
        console.log('Received Stripe session:', session);

        // ✅ Hide loading popup before redirect
        this.popupService.hideLoading();

        await stripe?.redirectToCheckout({
          sessionId: session.id
        });
      },
      error: (error: any) => {
        // ❌ Hide loading and show error
        this.popupService.hideLoading();
        this.popupService.showMessage('Error', 'Checkout failed. Please try again.', 'error');
        console.error('Checkout error:', error);
      }
    });
  }, 5000);
}




}
