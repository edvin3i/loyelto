import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../app/utils/apiClient';
import { User } from '../utils/providers/stores/authStore';

// Query Keys
export const queryKeys = {
  user: (id?: string) => ['user', id],
  currentUser: () => ['user', 'me'],
  businesses: (params?: any) => ['businesses', params],
  business: (id: string) => ['business', id],
  loyaltyPoints: (userId?: string) => ['loyalty', 'points', userId],
  pointTransactions: (params?: any) => ['point-transactions', params],
  wallets: () => ['wallets'],
  balances: () => ['balances'],
  tokens: () => ['tokens'],
  swapTransactions: (params?: any) => ['swap-transactions', params],
  reviews: (businessId?: string) => ['reviews', businessId],
};

// User Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => apiClient.getUser(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<User> }) =>
      apiClient.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // Update the user cache
      queryClient.setQueryData(queryKeys.user(variables.userId), data);
      queryClient.setQueryData(queryKeys.currentUser(), data);
    },
  });
}

// Business Hooks
export function useBusinesses(start = 0, limit = 10) {
  return useQuery({
    queryKey: queryKeys.businesses({ start, limit }),
    queryFn: () => apiClient.getBusinesses(start, limit),
  });
}

export function useBusiness(businessId: string) {
  return useQuery({
    queryKey: queryKeys.business(businessId),
    queryFn: () => apiClient.getBusiness(businessId),
    enabled: !!businessId,
  });
}

// Loyalty Hooks
export function useLoyaltyPoints(userId?: string) {
  return useQuery({
    queryKey: queryKeys.loyaltyPoints(userId),
    queryFn: () => apiClient.getLoyaltyPoints(userId),
  });
}

export function usePointTransactions(start = 0, limit = 10) {
  return useQuery({
    queryKey: queryKeys.pointTransactions({ start, limit }),
    queryFn: () => apiClient.getPointTransactions(start, limit),
  });
}

// Wallet Hooks
export function useWallets() {
  return useQuery({
    queryKey: queryKeys.wallets(),
    queryFn: () => apiClient.getWallets(),
  });
}

export function useBalances() {
  return useQuery({
    queryKey: queryKeys.balances(),
    queryFn: () => apiClient.getBalances(),
  });
}

// Token Hooks
export function useTokens() {
  return useQuery({
    queryKey: queryKeys.tokens(),
    queryFn: () => apiClient.getTokens(),
  });
}

// Swap Hooks
export function useSwapTransactions(start = 0, limit = 10) {
  return useQuery({
    queryKey: queryKeys.swapTransactions({ start, limit }),
    queryFn: () => apiClient.getSwapTransactions(start, limit),
  });
}

// Review Hooks
export function useReviews(businessId?: string) {
  return useQuery({
    queryKey: queryKeys.reviews(businessId),
    queryFn: () => apiClient.getReviews(businessId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewData: any) => apiClient.createReview(reviewData),
    onSuccess: (data, variables) => {
      // Invalidate reviews cache
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// Auth Hooks
export function usePrivyHandshake() {
  return useMutation({
    mutationFn: (privyToken: string) => apiClient.privyHandshake(privyToken),
  });
} 