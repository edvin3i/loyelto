import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { apiService } from '../services/api';
import { API_BASE_URL } from '../config/environment';
import styles from './styles_api_test';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

interface ApiTestProps {
  onBack?: () => void;
}

export default function ApiTest({ onBack }: ApiTestProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateResult = (endpoint: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.endpoint === endpoint);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      } else {
        return [...prev, { endpoint, status, message, data }];
      }
    });
  };

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    updateResult(name, 'pending', 'Testing...');
    try {
      const result = await testFn();
      updateResult(name, 'success', 'Success', result);
      return result;
    } catch (error: any) {
      const message = error.message || error.toString();
      updateResult(name, 'error', message, error);
      return null;
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);

    // Test 1: Check if there are any public endpoints
    await testEndpoint('Check Public Root', async () => {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    });

    // Test 2: Check OpenAPI documentation (try multiple possible paths)
    await testEndpoint('OpenAPI Documentation', async () => {
      const possiblePaths = [
        `${API_BASE_URL.replace('/api/v1', '')}/openapi.json`,
        `${API_BASE_URL.replace('/api/v1', '')}/docs/openapi.json`,
        `${API_BASE_URL}/openapi.json`,
        `${API_BASE_URL.replace('/api/v1', '')}/api/openapi.json`
      ];
      
      for (const path of possiblePaths) {
        try {
          const response = await fetch(path, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            return { 
              title: data.info?.title, 
              version: data.info?.version,
              endpoints: Object.keys(data.paths || {}).length,
              path: path
            };
          }
        } catch (e) {
          // Continue to next path
        }
      }
      
      throw new Error('OpenAPI documentation not found at any expected path');
    });

    // Test 3: Test authentication endpoints (should be accessible)
    await testEndpoint('Auth Endpoints Check', async () => {
      // Try to access auth callback without code (should give validation error, not 404)
      const response = await fetch(`${API_BASE_URL}/auth/callback`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 422) {
        return { message: 'Auth endpoint exists (validation error expected)', status: response.status };
      } else if (response.status === 404) {
        throw new Error('Auth endpoint not found');
      } else {
        return { message: `Auth endpoint responded with ${response.status}`, status: response.status };
      }
    });

    // Test 4-8: Protected endpoints (expect 401)
    const protectedEndpoints = [
      { name: 'Users', path: '/users/' },
      { name: 'Tokens', path: '/tokens/' },
      { name: 'Wallets', path: '/wallets/' },
      { name: 'Balances', path: '/balances/' },
      { name: 'Point Transactions', path: '/point_txs/' },
    ];

    for (const endpoint of protectedEndpoints) {
      await testEndpoint(`${endpoint.name} (Protected)`, async () => {
        const response = await fetch(`${API_BASE_URL}${endpoint.path}?start=0&limit=5`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status === 401) {
          return { 
            message: '✅ Correctly requires authentication', 
            status: response.status,
            endpoint: endpoint.path
          };
        } else if (response.status === 404) {
          throw new Error('Endpoint not found (404)');
        } else if (response.ok) {
          const data = await response.json();
          return { 
            message: '⚠️ Unexpectedly accessible without auth', 
            status: response.status,
            data 
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      });
    }

    setIsLoading(false);
  };

  const runEndpointDiscovery = async () => {
    setIsLoading(true);
    setResults([]);

    // List of endpoints to test for availability
    const endpointsToTest = [
      { name: 'API Root', path: '/' },
      { name: 'Users', path: '/users/' },
      { name: 'Businesses', path: '/businesses/' },
      { name: 'Tokens', path: '/tokens/' },
      { name: 'Wallets', path: '/wallets/' },
      { name: 'Balances', path: '/balances/' },
      { name: 'Point Transactions', path: '/point_txs/' },
      { name: 'Swap Transactions', path: '/swap_txs/' },
      { name: 'Voucher Templates', path: '/voucher_templates/' },
      { name: 'Voucher NFTs', path: '/voucher_nfts/' },
      { name: 'Reviews', path: '/reviews/' },
      { name: 'Tasks', path: '/tasks/' },
      { name: 'Auth Handshake', path: '/auth/handshake' },
      { name: 'Auth Callback', path: '/auth/callback' },
    ];

    for (const endpoint of endpointsToTest) {
      await testEndpoint(`${endpoint.name} (${endpoint.path})`, async () => {
        const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const statusInfo = getEndpointStatusInfo(response.status, endpoint.path);
        
        if (statusInfo.isError) {
          throw new Error(statusInfo.message);
        } else {
          let data = null;
          try {
            if (response.headers.get('content-type')?.includes('application/json')) {
              data = await response.json();
            }
          } catch (e) {
            // Ignore JSON parsing errors for non-JSON responses
          }
          
          return { 
            status: response.status, 
            message: statusInfo.message,
            data: data ? (Array.isArray(data) ? `Array with ${data.length} items` : data) : null
          };
        }
      });
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getStatusBannerColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'partial': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#666';
    }
  };

  const getEndpointStatusInfo = (status: number, path: string) => {
    switch (status) {
      case 200:
        return { isError: false, message: '✅ Endpoint accessible and working' };
      case 401:
        return { isError: false, message: '🔒 Requires authentication (expected)' };
      case 403:
        return { isError: false, message: '🚫 Forbidden (endpoint exists)' };
      case 404:
        return { isError: true, message: '❌ Endpoint not found (404)' };
      case 405:
        return { isError: false, message: '⚠️ Method not allowed (endpoint exists, try POST)' };
      case 422:
        return { isError: false, message: '📝 Validation error (endpoint exists)' };
      case 500:
        return { isError: true, message: '💥 Server error (500)' };
      default:
        if (status >= 200 && status < 300) {
          return { isError: false, message: `✅ Success (${status})` };
        } else if (status >= 400 && status < 500) {
          return { isError: false, message: `⚠️ Client error (${status}) - endpoint exists` };
        } else {
          return { isError: true, message: `❌ Server error (${status})` };
        }
    }
  };

  const getOverallStatus = () => {
    if (results.length === 0) return null;
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const total = results.length;
    
    if (successCount === total) return { status: 'excellent', message: 'All tests passed!' };
    if (successCount > errorCount) return { status: 'good', message: 'Most tests passed' };
    if (successCount > 0) return { status: 'partial', message: 'Some tests passed' };
    return { status: 'poor', message: 'Most tests failed' };
  };

  const overallStatus = getOverallStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.subtitle}>Testing: {API_BASE_URL}</Text>
      
      {overallStatus && (
        <View style={[styles.statusBanner, { backgroundColor: getStatusBannerColor(overallStatus.status) }]}>
          <Text style={styles.statusText}>{overallStatus.message}</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={runTests}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Running Tests...' : 'API Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.discoveryButton]} 
          onPress={runEndpointDiscovery}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Discovering...' : 'Discover'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        
        {onBack && (
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={onBack}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>{getStatusIcon(result.status)}</Text>
              <Text style={styles.resultEndpoint}>{result.endpoint}</Text>
            </View>
            
            <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
              {result.message}
            </Text>
            
            {result.data && result.status === 'success' && (
              <TouchableOpacity 
                onPress={() => Alert.alert('Response Data', JSON.stringify(result.data, null, 2))}
              >
                <Text style={styles.dataPreview}>
                  📄 Tap to view response data
                </Text>
              </TouchableOpacity>
            )}
            
            {result.data && result.status === 'error' && (
              <Text style={styles.errorDetails}>
                Status: {result.data.status || 'Unknown'}
                {result.data.detail && `\nDetail: ${result.data.detail}`}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 