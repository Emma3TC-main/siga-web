import { useEffect, useState } from 'react';
import { lotRepository, assetRepository } from '../../../../app/compositionRoot';
import type { Lot } from '../../../../domain/entities/Lot';
import type { Asset } from '../../../../domain/entities/Asset';

interface UseTraceabilityOptionsParams {
  productId?: string;
  locationId?: string;
  isOutbound: boolean; // if true, filter by location and availableOnly/IN_STOCK
  requiresLot: boolean;
  requiresAsset: boolean;
  selectedLotId?: string; // used for filtering assets if both lot and asset are required and outbound
}

export function useTraceabilityOptions({
  productId,
  locationId,
  isOutbound,
  requiresLot,
  requiresAsset,
  selectedLotId
}: UseTraceabilityOptionsParams) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingLots, setLoadingLots] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [lotsError, setLotsError] = useState<string | null>(null);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (requiresLot && productId && (isOutbound ? locationId : true)) {
      setLoadingLots(true);
      setLotsError(null);

      lotRepository.getLots({
        productId,
        ...(isOutbound ? { locationId, availableOnly: true } : { availableOnly: false })
      })
        .then(result => {
          if (!cancelled) {
            setLots(result);
            setLoadingLots(false);
          }
        })
        .catch(err => {
          if (!cancelled) {
            setLotsError(err.message || 'Error al cargar lotes');
            setLoadingLots(false);
          }
        });
    } else {
      setLots([]);
    }

    return () => {
      cancelled = true;
    };
  }, [productId, locationId, isOutbound, requiresLot]);

  useEffect(() => {
    let cancelled = false;

    if (requiresAsset && productId && (isOutbound ? locationId : true)) {
      setLoadingAssets(true);
      setAssetsError(null);

      assetRepository.getAssets({
        productId,
        availability: isOutbound ? 'IN_STOCK' : 'UNASSIGNED',
        ...(isOutbound ? { locationId } : {}),
        ...(isOutbound && requiresLot && selectedLotId ? { lotId: selectedLotId } : {})
      })
        .then(result => {
          if (!cancelled) {
            setAssets(result);
            setLoadingAssets(false);
          }
        })
        .catch(err => {
          if (!cancelled) {
            setAssetsError(err.message || 'Error al cargar series');
            setLoadingAssets(false);
          }
        });
    } else {
      setAssets([]);
    }

    return () => {
      cancelled = true;
    };
  }, [productId, locationId, isOutbound, requiresAsset, requiresLot, selectedLotId]);

  return {
    lots,
    assets,
    loadingLots,
    loadingAssets,
    lotsError,
    assetsError
  };
}
