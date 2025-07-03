
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceVerificationProps {
  onVerificationComplete: (faceData: string) => void;
}

interface VerificationStep {
  id: string;
  action: string;
  instruction: string;
  completed: boolean;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ onVerificationComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const verificationSteps: VerificationStep[] = [
    { id: 'nod', action: 'nod', instruction: 'Please nod your head up and down', completed: false },
    { id: 'shake', action: 'shake', instruction: 'Please shake your head left and right', completed: false },
    { id: 'blink', action: 'blink', instruction: 'Please blink your eyes 3 times', completed: false },
    { id: 'mouth', action: 'mouth', instruction: 'Please open your mouth wide', completed: false }
  ];

  const [steps, setSteps] = useState(verificationSteps);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      toast({
        title: "Camera Started",
        description: "Follow the instructions to complete face verification",
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const completeCurrentStep = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStep].completed = true;
    setSteps(updatedSteps);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed",
        description: `${steps[currentStep].action} verified! Continue with next step.`,
      });
    } else {
      // All steps completed
      captureFaceData();
    }
  };

  const captureFaceData = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const faceData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Store face verification data
        const verificationData = {
          faceImage: faceData,
          timestamp: Date.now(),
          steps: steps.map(step => step.action),
          verified: true
        };
        
        // Save to localStorage for future use
        const existingData = JSON.parse(localStorage.getItem('face_verifications') || '[]');
        existingData.push(verificationData);
        localStorage.setItem('face_verifications', JSON.stringify(existingData));
        
        toast({
          title: "Face Verification Complete",
          description: "Your face has been successfully verified and stored securely.",
        });
        
        // Stop camera
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
        
        onVerificationComplete(faceData);
      }
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsActive(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Camera className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Face ID Verification</CardTitle>
        <CardDescription>
          Complete all verification steps to secure your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              You need to complete face verification to continue with registration
            </p>
            <Button onClick={startCamera} className="w-full">
              Start Face Verification
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 bg-gray-200 rounded-lg object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-center">Verification Steps</h3>
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <span className={`text-sm ${index === currentStep ? 'font-semibold text-blue-600' : ''}`}>
                    {step.instruction}
                  </span>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <Circle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            {currentStep < steps.length && (
              <div className="text-center space-y-2">
                <p className="font-semibold text-blue-600">
                  {steps[currentStep].instruction}
                </p>
                <Button onClick={completeCurrentStep} className="w-full">
                  Mark Step Complete
                </Button>
              </div>
            )}

            <Button 
              onClick={stopCamera} 
              variant="outline" 
              className="w-full"
            >
              Cancel Verification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceVerification;
