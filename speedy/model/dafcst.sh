#!/bin/bash
#=======================================================================
# ensfcst.sh
#   This script runs the SPEEDY model with subdirectory $PROC
#=======================================================================

# Input for this shell
SPEEDY=$1
OUTPUT=$2
YMDH=$3
TYMDH=$4
MEM=$5
PROC=$6

TMPDIR=$2/DATA/tmp
OUTPUT=$2/DATA/ensemble
echo "Updating ensemble member $5"
cd $TMPDIR/ensfcst

# Create directory for this process
rm -rf $MEM
mkdir $MEM
cp $SPEEDY/DATA/tmp/letkf/ensfcst/imp $MEM

# Set up boundary files
SB=$SPEEDY/model/data/bc/t30/clim
SC=$SPEEDY/model/data/bc/t30/anom
ln -s $SB/sfc.grd   $MEM/fort.20
ln -s $SB/sst.grd   $MEM/fort.21
ln -s $SB/icec.grd  $MEM/fort.22
ln -s $SB/stl.grd   $MEM/fort.23
ln -s $SB/snowd.grd $MEM/fort.24
ln -s $SB/swet.grd  $MEM/fort.26
cp    $SC/ssta.grd  $MEM/fort.30

# Run
cd $MEM
ln -fs $OUTPUT/anal/$MEM/init.grd fort.90
ln -fs $OUTPUT/gues/$MEM/fluxes.grd fluxes.grd
FORT2=2
echo $FORT2 > fort.2
echo $YMDH | cut -c1-4 >> fort.2
echo $YMDH | cut -c5-6 >> fort.2
echo $YMDH | cut -c7-8 >> fort.2
echo $YMDH | cut -c9-10 >> fort.2
./imp > out.lis 2> out.lis.2
# Move output
# mv ${YMDH}.grd $OUTPUT/anal_f/$MEM
ls
echo " Output folder $OUTPUT/gues/$MEM"
mv ${TYMDH}.grd $OUTPUT/gues/$MEM
echo "Finished"
exit 0
