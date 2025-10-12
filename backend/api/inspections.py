"""
FastAPI endpoints for property inspection and AI analysis
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
import os
import uuid
from pathlib import Path
from datetime import datetime
from services.vision_service import VisionService
from core.models import PropertyInspection, Property
from django.contrib.auth.models import User

router = APIRouter()

# Create uploads directory
UPLOAD_DIR = Path("uploads/inspections")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/analyze")
async def analyze_property_images(
    property_id: int = Form(...),
    inspection_type: str = Form("routine"),
    images: List[UploadFile] = File(...)
):
    """
    Upload and analyze property images using GPT-4V
    
    Args:
        property_id: Property ID to inspect
        inspection_type: Type of inspection (routine, roof, hvac, etc.)
        images: List of image files to analyze
        
    Returns:
        Analysis results with damage detection and recommendations
    """
    try:
        # Verify property exists
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Save uploaded images
        saved_image_paths = []
        for image in images:
            # Generate unique filename
            file_extension = image.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await image.read()
                buffer.write(content)
            
            saved_image_paths.append(str(file_path))
        
        # Analyze images based on inspection type
        if inspection_type == "roof":
            # Specialized roof analysis
            analysis_result = VisionService.analyze_roof_condition(saved_image_paths[0])
        else:
            # General property inspection
            analysis_result = VisionService.analyze_multiple_images(saved_image_paths)
        
        # Create inspection record
        inspection = PropertyInspection.objects.create(
            property=property_obj,
            inspection_date=datetime.now(),
            inspection_type=inspection_type,
            images=saved_image_paths,
            ai_report=analysis_result
        )
        
        # Extract overall condition if available
        if 'consolidated_analysis' in analysis_result:
            inspection.overall_condition = analysis_result['consolidated_analysis'].get('overall_condition')
            inspection.severity_score = int(analysis_result['consolidated_analysis'].get('average_severity', 0))
        elif 'roof_analysis' in analysis_result:
            inspection.severity_score = analysis_result['roof_analysis'].get('condition_score', 0)
        
        inspection.save()
        
        return {
            "success": True,
            "inspection_id": inspection.id,
            "property_id": property_id,
            "images_analyzed": len(saved_image_paths),
            "analysis": analysis_result,
            "created_at": inspection.created_at.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/property/{property_id}")
async def get_property_inspections(
    property_id: int,
    limit: int = 10
):
    """
    Get inspection history for a property
    """
    try:
        inspections = PropertyInspection.objects.filter(
            property_id=property_id
        ).order_by('-inspection_date')[:limit]
        
        results = []
        for inspection in inspections:
            results.append({
                "id": inspection.id,
                "inspection_date": inspection.inspection_date.isoformat(),
                "inspection_type": inspection.inspection_type,
                "overall_condition": inspection.overall_condition,
                "severity_score": inspection.severity_score,
                "images_count": len(inspection.images) if inspection.images else 0,
                "ai_report": inspection.ai_report
            })
        
        return {
            "property_id": property_id,
            "total_inspections": len(results),
            "inspections": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{inspection_id}")
async def get_inspection_detail(inspection_id: int):
    """
    Get detailed inspection report
    """
    try:
        inspection = PropertyInspection.objects.get(id=inspection_id)
        
        return {
            "id": inspection.id,
            "property": {
                "id": inspection.property.id,
                "name": inspection.property.name,
                "address": inspection.property.address
            },
            "inspection_date": inspection.inspection_date.isoformat(),
            "inspection_type": inspection.inspection_type,
            "overall_condition": inspection.overall_condition,
            "severity_score": inspection.severity_score,
            "images": inspection.images,
            "ai_report": inspection.ai_report,
            "notes": inspection.notes,
            "created_at": inspection.created_at.isoformat()
        }
        
    except PropertyInspection.DoesNotExist:
        raise HTTPException(status_code=404, detail="Inspection not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

