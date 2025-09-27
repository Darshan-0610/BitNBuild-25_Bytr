import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Camera, CheckCircle, XCircle, RotateCcw, Package } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ScanResult {
  id: string;
  tiffinId: string;
  customerName: string;
  returnTime: string;
  condition: 'good' | 'damaged' | 'dirty';
  status: 'success' | 'error';
}

interface QRScanPageProps {
  onNavigate: (page: string) => void;
}

export function QRScanPage({ onNavigate }: QRScanPageProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock QR scanning function (since html5-qrcode might not work in this environment)
  const simulateQRScan = () => {
    setIsScanning(true);
    setError(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const mockResults = [
        {
          id: 'scan_001',
          tiffinId: 'TF2024090001',
          customerName: 'Priya Sharma',
          returnTime: new Date().toLocaleTimeString(),
          condition: 'good',
          status: 'success'
        },
        {
          id: 'scan_002', 
          tiffinId: 'TF2024090002',
          customerName: 'Rahul Kumar',
          returnTime: new Date().toLocaleTimeString(),
          condition: 'damaged',
          status: 'success'
        },
        {
          id: 'scan_003',
          tiffinId: 'INVALID_CODE',
          customerName: '',
          returnTime: new Date().toLocaleTimeString(),
          condition: 'good',
          status: 'error'
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      if (randomResult.status === 'error') {
        setError('Invalid QR code or tiffin not found');
      } else {
        setScanResults(prev => [randomResult, ...prev]);
        setLastScanResult(randomResult);
      }
      
      setIsScanning(false);
    }, 2000);
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      // In a real implementation, you would start the camera here
      // For this demo, we'll just simulate the scanning
      simulateQRScan();
    } catch (err) {
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setError(null);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'dirty': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'damaged': return <XCircle className="w-4 h-4" />;
      case 'dirty': return <RotateCcw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Summary statistics
  const totalReturns = scanResults.length;
  const goodCondition = scanResults.filter(r => r.condition === 'good').length;
  const needsCleaning = scanResults.filter(r => r.condition === 'dirty').length;
  const damaged = scanResults.filter(r => r.condition === 'damaged').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="pt-16 lg:pt-20 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('admin')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Scanner</h1>
              <p className="text-sm text-gray-600">Scan returned tiffins to track waste and returns</p>
            </div>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Scanner */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scanner Interface */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {isScanning ? (
                      <div className="text-center text-white">
                        <div className="relative">
                          {/* Scanning animation overlay */}
                          <div className="absolute inset-0 border-2 border-green-500 rounded-lg">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-pulse"></div>
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-green-500 animate-pulse"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-1 bg-green-500 animate-pulse"></div>
                          </div>
                          <div className="p-8">
                            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-lg font-medium">Scanning QR Code...</p>
                            <p className="text-sm text-gray-300 mt-2">Position the QR code within the frame</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-300">Camera Preview</p>
                        <p className="text-sm text-gray-400 mt-2">Click start scanning to begin</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex space-x-4">
                  {!isScanning ? (
                    <Button 
                      onClick={startCamera}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopScanning}
                      variant="outline"
                      className="flex-1"
                    >
                      Stop Scanning
                    </Button>
                  )}
                  <Button 
                    onClick={simulateQRScan}
                    variant="outline"
                    disabled={isScanning}
                  >
                    Demo Scan
                  </Button>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {lastScanResult && lastScanResult.status === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully scanned tiffin {lastScanResult.tiffinId} from {lastScanResult.customerName}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No scans yet. Start scanning to see results here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanResults.map((result, index) => (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{result.tiffinId}</h4>
                            <Badge className={getConditionColor(result.condition)}>
                              {getConditionIcon(result.condition)}
                              <span className="ml-1 capitalize">{result.condition}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{result.customerName}</p>
                          <p className="text-xs text-gray-500">Returned at {result.returnTime}</p>
                        </div>
                        <div className="text-right">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600">{totalReturns}</h3>
                    <p className="text-sm text-blue-800">Total Returns</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600">{goodCondition}</h3>
                    <p className="text-sm text-green-800">Good Condition</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-yellow-600">{needsCleaning}</h3>
                    <p className="text-sm text-yellow-800">Needs Cleaning</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-red-600">{damaged}</h3>
                    <p className="text-sm text-red-800">Damaged</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scanning Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-sm text-gray-700">Click "Start Scanning" to activate camera</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-sm text-gray-700">Position QR code within the scanner frame</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-sm text-gray-700">Wait for automatic detection and scan</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-sm text-gray-700">Check condition and confirm return</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Good Condition</p>
                    <p className="text-xs text-green-600">Clean, undamaged, ready for reuse</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                  <RotateCcw className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Needs Cleaning</p>
                    <p className="text-xs text-yellow-600">Requires washing before reuse</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-red-50 rounded">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Damaged</p>
                    <p className="text-xs text-red-600">Requires repair or replacement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
